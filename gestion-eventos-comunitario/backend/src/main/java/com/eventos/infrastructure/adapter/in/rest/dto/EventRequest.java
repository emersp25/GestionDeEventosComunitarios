package com.eventos.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*DTO para crear un evento Validaciones con Bean Validation*/

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    @NotBlank(message = "El nombre del evento es requerido")
    @Size(min = 3, max = 200, message = "El nombre debe tener entre 3 y 200 caracteres")
    private String nombre;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    @NotNull(message = "La fecha de inicio es requerida")
    @Future(message = "La fecha de inicio debe ser futura")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es requerida")
    private LocalDateTime fechaFin;

    @NotBlank(message = "La ubicacion es requerida")
    @Size(max = 300, message = "La ubicación no puede exceder 300 caracteres")
    private String ubicacion;

    @NotNull(message = "La capacidad máxima es requerida")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Max(value = 10000, message = "La capacidad no puede exceder 10000")
    private Integer capacidadMaxima;

    @NotBlank(message = "El organizador es requerido")
    @Size(max = 200, message = "El nombre del organizador no puede exceder 200 caracteres")
    private String organizador;

    @NotNull(message = "El presupuesto solicitado es requerido")
    @DecimalMin(value = "0.0", inclusive = true, message = "El presupuesto no puede ser negativo")
    private BigDecimal presupuestoSolicitado;
}