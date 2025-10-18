package com.eventos.infrastructure.adapter.in.rest.dto.report;

import java.util.List;

public class EventInscritosResponse {
    private String eventId;
    private String eventNombre;
    private long totalInscripciones;
    private long totalInscripcionesActivas;
    private List<EventInscriptionItemResponse> items;

    public EventInscritosResponse() {}
    public EventInscritosResponse(String eventId, String eventNombre, long totalInscripciones, long totalInscripcionesActivas, List<EventInscriptionItemResponse> items) {
        this.eventId = eventId;
        this.eventNombre = eventNombre;
        this.totalInscripciones = totalInscripciones;
        this.totalInscripcionesActivas = totalInscripcionesActivas;
        this.items = items;
    }
    public String getEventId() { return eventId; }
    public String getEventNombre() { return eventNombre; }
    public long getTotalInscripciones() { return totalInscripciones; }
    public long getTotalInscripcionesActivas() { return totalInscripcionesActivas; }
    public List<EventInscriptionItemResponse> getItems() { return items; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public void setEventNombre(String eventNombre) { this.eventNombre = eventNombre; }
    public void setTotalInscripciones(long totalInscripciones) { this.totalInscripciones = totalInscripciones; }
    public void setTotalInscripcionesActivas(long totalInscripcionesActivas) { this.totalInscripcionesActivas = totalInscripcionesActivas; }
    public void setItems(List<EventInscriptionItemResponse> items) { this.items = items; }
}

