package com.eventos.infrastructure.adapter.in.rest.dto.report;

import java.time.LocalDateTime;

public class TopEventResponse {
    private String eventId;
    private String nombre;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private long totalInscritos;

    public TopEventResponse() {}
    public TopEventResponse(String eventId, String nombre, LocalDateTime fechaInicio, LocalDateTime fechaFin, long totalInscritos) {
        this.eventId = eventId;
        this.nombre = nombre;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.totalInscritos = totalInscritos;
    }
    public String getEventId() { return eventId; }
    public String getNombre() { return nombre; }
    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public long getTotalInscritos() { return totalInscritos; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
    public void setTotalInscritos(long totalInscritos) { this.totalInscritos = totalInscritos; }
}
