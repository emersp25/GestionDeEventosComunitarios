package com.eventos.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/*Entidad de dominio - Event (Evento Comunitario)
 Nucleo de la arquitectura */

public class Event {
    private final String id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String ubicacion;
    private Integer capacidadMaxima;
    private EventStatus status;
    private BigDecimal presupuestoSolicitado;
    private BigDecimal presupuestoAprobado;
    private String organizador;
    private List<String> inscripcionesIds;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructor para nuevo evento
    public Event(String nombre, String descripcion, LocalDateTime fechaInicio,
                 LocalDateTime fechaFin, String ubicacion, Integer capacidadMaxima,
                 String organizador, BigDecimal presupuestoSolicitado) {
        this.id = UUID.randomUUID().toString();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ubicacion = ubicacion;
        this.capacidadMaxima = capacidadMaxima;
        this.organizador = organizador;
        this.presupuestoSolicitado = presupuestoSolicitado;
        this.status = EventStatus.PENDIENTE_APROBACION;
        this.inscripcionesIds = new ArrayList<>();
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Constructor para reconstrucción desde BD
    public Event(String id, String nombre, String descripcion, LocalDateTime fechaInicio,
                 LocalDateTime fechaFin, String ubicacion, Integer capacidadMaxima,
                 EventStatus status, BigDecimal presupuestoSolicitado, BigDecimal presupuestoAprobado,
                 String organizador, List<String> inscripcionesIds, LocalDateTime fechaCreacion,
                 LocalDateTime fechaActualizacion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ubicacion = ubicacion;
        this.capacidadMaxima = capacidadMaxima;
        this.status = status;
        this.presupuestoSolicitado = presupuestoSolicitado;
        this.presupuestoAprobado = presupuestoAprobado;
        this.organizador = organizador;
        this.inscripcionesIds = inscripcionesIds != null ? inscripcionesIds : new ArrayList<>();
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }

    // Métodos de negocio
    public void aprobarPresupuesto(BigDecimal montoAprobado) {
        if (this.status != EventStatus.PENDIENTE_APROBACION) {
            throw new IllegalStateException("El evento no está pendiente de aprobación");
        }
        if (montoAprobado.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto aprobado debe ser mayor a cero");
        }
        this.presupuestoAprobado = montoAprobado;
        this.status = EventStatus.APROBADO;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public void rechazarPresupuesto() {
        if (this.status != EventStatus.PENDIENTE_APROBACION) {
            throw new IllegalStateException("El evento no está pendiente de aprobación");
        }
        this.status = EventStatus.RECHAZADO;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public void agregarInscripcion(String inscripcionId) {
        if (this.status != EventStatus.APROBADO) {
            throw new IllegalStateException("Solo se puede inscribir a eventos aprobados");
        }
        if (inscripcionesIds.size() >= capacidadMaxima) {
            throw new IllegalStateException("El evento ha alcanzado su capacidad máxima");
        }
        inscripcionesIds.add(inscripcionId);
        this.fechaActualizacion = LocalDateTime.now();
    }

    public void cancelarInscripcion(String inscripcionId) {
        if (!inscripcionesIds.remove(inscripcionId)) {
            throw new IllegalArgumentException("La inscripción no existe en este evento");
        }
        this.fechaActualizacion = LocalDateTime.now();
    }

    public void cancelarEvento() {
        if (this.status == EventStatus.CANCELADO) {
            throw new IllegalStateException("El evento ya está cancelado");
        }
        this.status = EventStatus.CANCELADO;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public void actualizarInformacion(String nombre, String descripcion, LocalDateTime fechaInicio,
                                      LocalDateTime fechaFin, String ubicacion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ubicacion = ubicacion;
        this.fechaActualizacion = LocalDateTime.now();
    }

    public boolean tieneCuposDisponibles() {
        return inscripcionesIds.size() < capacidadMaxima;
    }

    public int getCuposDisponibles() {
        return capacidadMaxima - inscripcionesIds.size();
    }

    // Getters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public String getUbicacion() { return ubicacion; }
    public Integer getCapacidadMaxima() { return capacidadMaxima; }
    public EventStatus getStatus() { return status; }
    public BigDecimal getPresupuestoSolicitado() { return presupuestoSolicitado; }
    public BigDecimal getPresupuestoAprobado() { return presupuestoAprobado; }
    public String getOrganizador() { return organizador; }
    public List<String> getInscripcionesIds() { return new ArrayList<>(inscripcionesIds); }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }

}
