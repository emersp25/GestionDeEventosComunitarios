package com.eventos.infrastructure.adapter.in.rest.dto;

import com.eventos.domain.model.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/*DTO para responder informacion de un event*/

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private String id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String ubicacion;
    private Integer capacidadMaxima;
    private EventStatus status;
    private String statusDescripcion;
    private BigDecimal presupuestoSolicitado;
    private BigDecimal presupuestoAprobado;
    private String organizador;
    private Integer totalInscripciones;
    private Integer cuposDisponibles;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}