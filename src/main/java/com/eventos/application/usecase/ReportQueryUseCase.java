package com.eventos.application.usecase;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.model.InscriptionStatus;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

public class ReportQueryUseCase {

    private final EventRepository eventRepository;
    private final InscriptionRepository inscriptionRepository;

    public ReportQueryUseCase(EventRepository eventRepository,
                              InscriptionRepository inscriptionRepository) {
        this.eventRepository = eventRepository;
        this.inscriptionRepository = inscriptionRepository;
    }

    public List<MonthlyEventsReport> eventosRealizadosPorMes(int year) {
        LocalDateTime start = YearMonth.of(year, 1).atDay(1).atStartOfDay();
        LocalDateTime end = YearMonth.of(year, 12).atEndOfMonth().atTime(23, 59, 59);
        return eventosRealizadosPorMes(start, end);
    }

    public TotalesReport totales() {
        return totales(null, null);
    }

    // 1) Eventos realizados por mes (con rango opcional)
    public List<MonthlyEventsReport> eventosRealizadosPorMes(LocalDateTime start, LocalDateTime end) {
        final LocalDateTime from;
        final LocalDateTime to;

        if (start == null || end == null) {
            LocalDate today = LocalDate.now();
            from = today.withDayOfMonth(1).atStartOfDay();
            to   = today.withDayOfMonth(today.lengthOfMonth()).atTime(23, 59, 59);
        } else {
            from = start;
            to   = end;
        }

        List<Event> events;
        try {
            events = eventRepository.findByDateRange(from, to);
        } catch (UnsupportedOperationException e) {
            events = eventRepository.findAll().stream()
                    .filter(e2 -> notNull(e2.getFechaInicio()))
                    .filter(e2 -> !e2.getFechaInicio().isBefore(from) && !e2.getFechaInicio().isAfter(to))
                    .toList();
        }

        Map<YearMonth, Long> grouped = events.stream()
                .filter(e -> e.getStatus() == EventStatus.APROBADO)
                .filter(e -> notNull(e.getFechaFin()) && e.getFechaFin().isBefore(LocalDateTime.now()))
                .collect(Collectors.groupingBy(
                        e -> YearMonth.from(e.getFechaInicio()), Collectors.counting()
                ));

        List<MonthlyEventsReport> result = new ArrayList<>();
        YearMonth cursor = YearMonth.from(from);
        YearMonth last   = YearMonth.from(to);
        while (!cursor.isAfter(last)) {
            long count = grouped.getOrDefault(cursor, 0L);
            result.add(new MonthlyEventsReport(cursor, count));
            cursor = cursor.plusMonths(1);
        }
        return result;
    }


    // 2) Totales (con rango opcional)
    public TotalesReport totales(LocalDateTime start, LocalDateTime end) {
        final LocalDateTime from = start;
        final LocalDateTime to   = end;
        LocalDateTime now = LocalDateTime.now();

        List<Event> events = eventRepository.findAll();
        if (from != null && to != null) {
            events = events.stream()
                    .filter(e -> notNull(e.getFechaInicio()))
                    .filter(e -> !e.getFechaInicio().isBefore(from) && !e.getFechaInicio().isAfter(to))
                    .toList();
        }

        List<Inscription> inscriptions = inscriptionRepository.findAll();

        long totalEventosRealizados = events.stream()
                .filter(e -> e.getStatus() == EventStatus.APROBADO)
                .filter(e -> notNull(e.getFechaFin()) && e.getFechaFin().isBefore(now))
                .count();

        BigDecimal presupuestoEjecutado = events.stream()
                .filter(e -> e.getStatus() == EventStatus.APROBADO)
                .filter(e -> notNull(e.getFechaFin()) && e.getFechaFin().isBefore(now))
                .map(Event::getPresupuestoAprobado)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalParticipantes = inscriptions.stream()
                .filter(i -> i.getStatus() != null && i.getStatus() != InscriptionStatus.CANCELADA)
                .count();

        return new TotalesReport(totalEventosRealizados, totalParticipantes, presupuestoEjecutado);
    }


    // 3) Top N eventos con más inscritos (con rango opcional)
    public List<TopEvent> topEventosMasInscritos(int limit, LocalDateTime start, LocalDateTime end) {
        final LocalDateTime from = start;
        final LocalDateTime to   = end;

        List<Event> events = eventRepository.findAll();
        if (from != null && to != null) {
            events = events.stream()
                    .filter(e -> notNull(e.getFechaInicio()))
                    .filter(e -> !e.getFechaInicio().isBefore(from) && !e.getFechaInicio().isAfter(to))
                    .toList();
        }

        Map<String, Long> counts = new HashMap<>();
        for (Event e : events) {
            List<Inscription> insc = inscriptionRepository.findByEventId(e.getId());
            long c = insc.stream()
                    .filter(i -> i.getStatus() != null && i.getStatus() != InscriptionStatus.CANCELADA)
                    .count();
            counts.put(e.getId(), c);
        }

        return events.stream()
                .sorted(Comparator.comparingLong((Event e) -> counts.getOrDefault(e.getId(), 0L)).reversed())
                .limit(Math.max(1, limit))
                .map(e -> new TopEvent(e.getId(), e.getNombre(), e.getFechaInicio(), e.getFechaFin(),
                        counts.getOrDefault(e.getId(), 0L)))
                .toList();
    }


    // ====== NUEVO 2: Detalle de inscritos por evento ======
    public EventInscritosDetail inscritosPorEvento(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado: " + eventId));

        List<Inscription> insc = inscriptionRepository.findByEventId(eventId);

        List<InscriptionItem> items = insc.stream()
                .map(i -> new InscriptionItem(
                        i.getId(),
                        safeNombre(i),
                        i.getParticipanteEmail(),
                        i.getStatus() == null ? null : i.getStatus().name()
                ))
                .toList();

        long totalNoCanceladas = insc.stream()
                .filter(i -> i.getStatus() != null && i.getStatus() != InscriptionStatus.CANCELADA)
                .count();

        return new EventInscritosDetail(
                event.getId(),
                event.getNombre(),
                items.size(),
                totalNoCanceladas,
                items
        );
    }

    private boolean notNull(Object o) { return o != null; }

    private String safeNombre(Inscription i) {
        try {
            // Basado en tus mensajes previos
            return (String) Inscription.class.getMethod("getParticipanteNombre").invoke(i);
        } catch (ReflectiveOperationException e) {
            return "N/D";
        }
    }

    // ====== DTOs internos ======
    public record MonthlyEventsReport(YearMonth month, long total) {}
    public record TotalesReport(long totalEventosRealizados, long totalParticipantes, BigDecimal presupuestoEjecutado) {}

    public record TopEvent(String eventId, String nombre, LocalDateTime fechaInicio, LocalDateTime fechaFin, long totalInscritos) {}

    public record InscriptionItem(String inscriptionId, String participanteNombre, String participanteEmail, String status) {}

    public record EventInscritosDetail(String eventId, String eventNombre, long totalInscripciones, long totalInscripcionesActivas, List<InscriptionItem> items) {}

}
