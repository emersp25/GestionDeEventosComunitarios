package com.eventos.infrastructure.adapter.in.rest.dto;

import com.eventos.domain.model.InscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*DTO para responder información de una inscripción*/

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionResponse {

    private String id;
    private String eventId;
    private String eventNombre;
    private String participanteNombre;
    private String participanteEmail;
    private String participanteTelefono;
    private InscriptionStatus status;
    private String statusDescripcion;
    private LocalDateTime fechaInscripcion;
    private String notasAdicionales;
}