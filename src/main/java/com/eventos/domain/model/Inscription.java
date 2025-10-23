package com.eventos.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

/*Entidad de dominio - Inscription (Inscripción)*/

public class Inscription {

    private final String id;
    private String eventId;
    private String participanteNombre;
    private String participanteEmail;
    private String participanteTelefono;
    private InscriptionStatus status;
    private LocalDateTime fechaInscripcion;
    private String notasAdicionales;

    // Constructor para nueva inscripción
    public Inscription(String eventId, String participanteNombre, String participanteEmail,
                       String participanteTelefono, String notasAdicionales) {
        this.id = UUID.randomUUID().toString();
        this.eventId = eventId;
        this.participanteNombre = participanteNombre;
        this.participanteEmail = participanteEmail;
        this.participanteTelefono = participanteTelefono;
        this.notasAdicionales = notasAdicionales;
        this.status = InscriptionStatus.ACTIVA;
        this.fechaInscripcion = LocalDateTime.now();
    }

    // Constructor para reconstrucción desde BD
    public Inscription(String id, String eventId, String participanteNombre,
                       String participanteEmail, String participanteTelefono,
                       InscriptionStatus status, LocalDateTime fechaInscripcion,
                       String notasAdicionales) {
        this.id = id;
        this.eventId = eventId;
        this.participanteNombre = participanteNombre;
        this.participanteEmail = participanteEmail;
        this.participanteTelefono = participanteTelefono;
        this.status = status;
        this.fechaInscripcion = fechaInscripcion;
        this.notasAdicionales = notasAdicionales;
    }

    // Métodos de negocio
    public void cancelar() {
        if (this.status == InscriptionStatus.CANCELADA) {
            throw new IllegalStateException("La inscripción ya está cancelada");
        }
        this.status = InscriptionStatus.CANCELADA;
    }

    public void confirmarAsistencia() {
        if (this.status != InscriptionStatus.ACTIVA) {
            throw new IllegalStateException("Solo se puede confirmar asistencia de inscripciones activas");
        }
        this.status = InscriptionStatus.CONFIRMADA;
    }

    // Getters
    public String getId() { return id; }
    public String getEventId() { return eventId; }
    public String getParticipanteNombre() { return participanteNombre; }
    public String getParticipanteEmail() { return participanteEmail; }
    public String getParticipanteTelefono() { return participanteTelefono; }
    public InscriptionStatus getStatus() { return status; }
    public LocalDateTime getFechaInscripcion() { return fechaInscripcion; }
    public String getNotasAdicionales() { return notasAdicionales; }

}
