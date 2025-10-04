package com.eventos.application.usecase;

import com.eventos.domain.model.Event;
import com.eventos.domain.port.out.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Caso de Uso: Recibir Autorización o Rechazo de Presupuesto
 */

@Service
public class ApproveBudgetUseCase {
    private final EventRepository eventRepository;

    public ApproveBudgetUseCase(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Event approveEvent(String eventId, BigDecimal montoAprobado) {
        if (eventId == null || eventId.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del evento es requerido");
        }

        if (montoAprobado == null || montoAprobado.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto aprobado debe ser mayor a cero");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("El evento no existe"));

        event.aprobarPresupuesto(montoAprobado);

        return eventRepository.save(event);
    }

    @Transactional
    public Event rejectEvent(String eventId) {
        if (eventId == null || eventId.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del evento es requerido");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("El evento no existe"));

        event.rechazarPresupuesto();

        return eventRepository.save(event);
    }
}
