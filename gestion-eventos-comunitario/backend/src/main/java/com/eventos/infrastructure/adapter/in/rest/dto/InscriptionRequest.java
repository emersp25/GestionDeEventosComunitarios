package com.eventos.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*DTO para crear una inscripción*/
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionRequest {

    @NotBlank(message = "El ID del evento es requerido")
    private String eventId;

    @NotBlank(message = "El nombre del participante es requerido")
    @Size(min = 2, max = 200, message = "El nombre debe tener entre 2 y 200 caracteres")
    private String participanteNombre;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    private String participanteEmail;

    @Pattern(regexp = "^[0-9]{8,20}$", message = "El teléfono debe tener entre 8 y 20 dígitos")
    private String participanteTelefono;

    @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
    private String notasAdicionales;
}