package com.eventos.application.usecase;

import com.eventos.domain.model.Event;
import com.eventos.domain.port.out.EventRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*
 * Caso de Uso: Registrar Evento Comunitario
*/
@Service
public class CreateEventUseCase {
    private final EventRepository eventRepository;

    public CreateEventUseCase(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event execute(CreateEventCommand command) {
        validateCommand(command);

        Event event = new Event(
                command.nombre(),
                command.descripcion(),
                command.fechaInicio(),
                command.fechaFin(),
                command.ubicacion(),
                command.capacidadMaxima(),
                command.organizador(),
                command.presupuestoSolicitado()
        );

        return eventRepository.save(event);
    }

    private void validateCommand(CreateEventCommand command) {
        if (command.nombre() == null || command.nombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del evento es requerido");
        }

        if (command.fechaInicio() == null) {
            throw new IllegalArgumentException("La fecha de inicio es requerida");
        }

        if (command.fechaFin() == null) {
            throw new IllegalArgumentException("La fecha de fin es requerida");
        }

        if (command.fechaInicio().isAfter(command.fechaFin())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        if (command.fechaInicio().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser en el pasado");
        }

        if (command.capacidadMaxima() == null || command.capacidadMaxima() <= 0) {
            throw new IllegalArgumentException("La capacidad máxima debe ser mayor a cero");
        }

        if (command.presupuestoSolicitado() == null ||
                command.presupuestoSolicitado().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El presupuesto solicitado no puede ser negativo");
        }

        if (command.organizador() == null || command.organizador().trim().isEmpty()) {
            throw new IllegalArgumentException("El organizador es requerido");
        }
    }

    public record CreateEventCommand(
            String nombre,
            String descripcion,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            String ubicacion,
            Integer capacidadMaxima,
            String organizador,
            BigDecimal presupuestoSolicitado
    ) {}
}
