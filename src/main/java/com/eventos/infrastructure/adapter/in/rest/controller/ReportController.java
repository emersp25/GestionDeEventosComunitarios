package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.ReportQueryUseCase;
import com.eventos.infrastructure.adapter.in.rest.dto.ApiResponse;
import com.eventos.infrastructure.adapter.in.rest.dto.report.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reportes")
@CrossOrigin(origins = "*")
@Tag(name = "Reportes", description = "API para reportería de eventos")
public class ReportController {

    private final ReportQueryUseCase reportQueryUseCase;

    public ReportController(ReportQueryUseCase reportQueryUseCase) {
        this.reportQueryUseCase = reportQueryUseCase;
    }

    @Operation(summary = "Eventos realizados por mes (por año o rango opcional)")
    @GetMapping("/eventos-por-mes")
    public ApiResponse<List<MonthlyEventsReportResponse>> eventosPorMes(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        var data = (startDate != null && endDate != null)
                ? reportQueryUseCase.eventosRealizadosPorMes(startDate, endDate).stream()
                .map(m -> new MonthlyEventsReportResponse(m.month().getYear(), m.month().getMonthValue(), m.total()))
                .toList()
                : reportQueryUseCase.eventosRealizadosPorMes(year != null ? year : LocalDateTime.now().getYear()).stream()
                .map(m -> new MonthlyEventsReportResponse(m.month().getYear(), m.month().getMonthValue(), m.total()))
                .toList();

        String msg = (startDate != null && endDate != null)
                ? "Eventos realizados por mes en rango"
                : "Eventos realizados por mes para el año " + (year != null ? year : LocalDateTime.now().getYear());
        return ApiResponse.success(data, msg);
    }

    @Operation(summary = "Totales (eventos realizados, participantes, presupuesto ejecutado) con rango opcional")
    @GetMapping("/totales")
    public ApiResponse<TotalesReportResponse> totales(
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        var t = (startDate != null && endDate != null)
                ? reportQueryUseCase.totales(startDate, endDate)
                : reportQueryUseCase.totales();

        var data = new TotalesReportResponse(t.totalEventosRealizados(), t.totalParticipantes(), t.presupuestoEjecutado());
        return ApiResponse.success(data, "Totales de reportería");
    }

    @Operation(summary = "Top N eventos con más inscritos (excluye cancelados)")
    @GetMapping("/top-eventos")
    public ApiResponse<List<TopEventResponse>> topEventos(
            @RequestParam(name = "limit", defaultValue = "5") int limit,
            @RequestParam(name = "startDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(name = "endDate", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        var list = reportQueryUseCase.topEventosMasInscritos(limit, startDate, endDate).stream()
                .map(e -> new TopEventResponse(e.eventId(), e.nombre(), e.fechaInicio(), e.fechaFin(), e.totalInscritos()))
                .toList();
        return ApiResponse.success(list, "Top " + limit + " eventos con más inscritos");
    }

    @Operation(summary = "Detalle de inscritos por evento")
    @GetMapping("/inscritos-por-evento/{eventId}")
    public ApiResponse<EventInscritosResponse> inscritosPorEvento(@PathVariable String eventId) {
        var d = reportQueryUseCase.inscritosPorEvento(eventId);
        var items = d.items().stream()
                .map(i -> new EventInscriptionItemResponse(i.inscriptionId(), i.participanteNombre(), i.participanteEmail(), i.status()))
                .toList();
        var data = new EventInscritosResponse(d.eventId(), d.eventNombre(), d.totalInscripciones(), d.totalInscripcionesActivas(), items);
        return ApiResponse.success(data, "Inscritos del evento " + d.eventNombre());
    }
}
