package com.eventos.domain.model;

/*Estados posibles de una inscripción*/

public enum InscriptionStatus {
    ACTIVA("Activa"),
    CONFIRMADA("Confirmada"),
    CANCELADA("Cancelada");

    private final String descripcion;

    InscriptionStatus(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
