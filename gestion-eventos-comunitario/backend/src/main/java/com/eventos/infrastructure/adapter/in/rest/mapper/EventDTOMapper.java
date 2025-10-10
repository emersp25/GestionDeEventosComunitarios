package com.eventos.infrastructure.adapter.in.rest.mapper;

import com.eventos.domain.model.Event;
import com.eventos.infrastructure.adapter.in.rest.dto.EventRequest;
import com.eventos.infrastructure.adapter.in.rest.dto.EventResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre DTOs y entidades de dominio
 */
@Component
public class EventDTOMapper {

    /**
     * Convierte EventResponse desde Event del dominio
     */
    public EventResponse toResponse(Event event) {
        if (event == null) {
            return null;
        }

        return EventResponse.builder()
                .id(event.getId())
                .nombre(event.getNombre())
                .descripcion(event.getDescripcion())
                .fechaInicio(event.getFechaInicio())
                .fechaFin(event.getFechaFin())
                .ubicacion(event.getUbicacion())
                .capacidadMaxima(event.getCapacidadMaxima())
                .status(event.getStatus())
                .statusDescripcion(event.getStatus().getDescripcion())
                .presupuestoSolicitado(event.getPresupuestoSolicitado())
                .presupuestoAprobado(event.getPresupuestoAprobado())
                .organizador(event.getOrganizador())
                .totalInscripciones(event.getInscripcionesIds().size())
                .cuposDisponibles(event.getCuposDisponibles())
                .fechaCreacion(event.getFechaCreacion())
                .fechaActualizacion(event.getFechaActualizacion())
                .build();
    }
}