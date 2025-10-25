package com.eventos.infrastructure.adapter.in.rest.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class UpdateEventRequest {
    @NotBlank(message = "El nombre del evento es requerido")
    private String nombre;

    private String descripcion;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    @NotBlank(message = "La ubicación es requerida")
    private String ubicacion;

    private Integer capacidadMaxima;

    private String estado;

    // getters/setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public Integer getCapacidadMaxima() { return capacidadMaxima; }
    public void setCapacidadMaxima(Integer capacidadMaxima) { this.capacidadMaxima = capacidadMaxima; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

