package com.eventos.infrastructure.adapter.in.rest.mapper;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;
import com.eventos.infrastructure.adapter.in.rest.dto.InscriptionResponse;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir Inscription a DTOs
 */
@Component
public class InscriptionDTOMapper {

    /**
     * Convierte InscriptionResponse desde Inscription del dominio
     */
    public InscriptionResponse toResponse(Inscription inscription, Event event) {
        if (inscription == null) {
            return null;
        }

        return InscriptionResponse.builder()
                .id(inscription.getId())
                .eventId(inscription.getEventId())
                .eventNombre(event != null ? event.getNombre() : null)
                .participanteNombre(inscription.getParticipanteNombre())
                .participanteEmail(inscription.getParticipanteEmail())
                .participanteTelefono(inscription.getParticipanteTelefono())
                .status(inscription.getStatus())
                .statusDescripcion(inscription.getStatus().getDescripcion())
                .fechaInscripcion(inscription.getFechaInscripcion())
                .notasAdicionales(inscription.getNotasAdicionales())
                .build();
    }

    /**
     * Sobrecarga sin evento (cuando no se necesita el nombre del evento)
     */
    public InscriptionResponse toResponse(Inscription inscription) {
        return toResponse(inscription, null);
    }
}