package com.eventos.domain.factory;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/*
 * Patrón Factory - Creación de entidades Event
 * Centraliza la lógica de creación y reconstrucción de eventos
*/

@Component
public class EventFactory {

    /*Crea un nuevo evento con valores por defecto*/
    public Event createNewEvent(String nombre, String descripcion, LocalDateTime fechaInicio,
                                LocalDateTime fechaFin, String ubicacion, Integer capacidadMaxima,
                                String organizador, BigDecimal presupuestoSolicitado) {

        return new Event(
                nombre,
                descripcion,
                fechaInicio,
                fechaFin,
                ubicacion,
                capacidadMaxima,
                organizador,
                presupuestoSolicitado
        );
    }

    /*Reconstruye un evento desde la base de datos*/
    public Event reconstructEvent(String id, String nombre, String descripcion,
                                  LocalDateTime fechaInicio, LocalDateTime fechaFin,
                                  String ubicacion, Integer capacidadMaxima,
                                  EventStatus status, BigDecimal presupuestoSolicitado,
                                  BigDecimal presupuestoAprobado, String organizador,
                                  List<String> inscripcionesIds, LocalDateTime fechaCreacion,
                                  LocalDateTime fechaActualizacion) {

        return new Event(
                id,
                nombre,
                descripcion,
                fechaInicio,
                fechaFin,
                ubicacion,
                capacidadMaxima,
                status,
                presupuestoSolicitado,
                presupuestoAprobado,
                organizador,
                inscripcionesIds,
                fechaCreacion,
                fechaActualizacion
        );
    }

    /*Crea un evento de tipo Workshop con configuración específica*/
    public Event createWorkshopEvent(String nombre, String descripcion, LocalDateTime fechaInicio,
                                     String ubicacion, String organizador) {
        return new Event(
                nombre,
                descripcion,
                fechaInicio,
                fechaInicio.plusHours(3), // Workshops duran 3 horas por defecto
                ubicacion,
                30, // Capacidad estándar para workshops
                organizador,
                new BigDecimal("500.00") // Presupuesto estándar
        );
    }

    /*Crea un evento de tipo Conferencia con configuración específica*/
    public Event createConferenceEvent(String nombre, String descripcion, LocalDateTime fechaInicio,
                                       String ubicacion, String organizador) {
        return new Event(
                nombre,
                descripcion,
                fechaInicio,
                fechaInicio.plusDays(1), // Conferencias duran 1 día por defecto
                ubicacion,
                100, // Mayor capacidad para conferencias
                organizador,
                new BigDecimal("2000.00") // Mayor presupuesto
        );
    }

    /*Crea un evento comunitario pequeño con configuración específica*/
    public Event createCommunityEvent(String nombre, String descripcion, LocalDateTime fechaInicio,
                                      String ubicacion, String organizador) {
        return new Event(
                nombre,
                descripcion,
                fechaInicio,
                fechaInicio.plusHours(4),
                ubicacion,
                50, // Capacidad moderada
                organizador,
                new BigDecimal("1000.00")
        );
    }
}
