package com.eventos.domain.model;

/*Estados posibles de un evento*/

public enum EventStatus {
    PENDIENTE_APROBACION("Pendiente de Aprobación"),
    APROBADO("Aprobado"),
    RECHAZADO("Rechazado"),
    CANCELADO("Cancelado"),
    FINALIZADO("Finalizado");

    private final String descripcion;

    EventStatus(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
