package com.eventos.infrastructure.adapter.in.rest.dto.report;

public class EventInscriptionItemResponse {
    private String inscriptionId;
    private String participanteNombre;
    private String participanteEmail;
    private String status;

    public EventInscriptionItemResponse() {}
    public EventInscriptionItemResponse(String inscriptionId, String participanteNombre, String participanteEmail, String status) {
        this.inscriptionId = inscriptionId;
        this.participanteNombre = participanteNombre;
        this.participanteEmail = participanteEmail;
        this.status = status;
    }
    public String getInscriptionId() { return inscriptionId; }
    public String getParticipanteNombre() { return participanteNombre; }
    public String getParticipanteEmail() { return participanteEmail; }
    public String getStatus() { return status; }
    public void setInscriptionId(String inscriptionId) { this.inscriptionId = inscriptionId; }
    public void setParticipanteNombre(String participanteNombre) { this.participanteNombre = participanteNombre; }
    public void setParticipanteEmail(String participanteEmail) { this.participanteEmail = participanteEmail; }
    public void setStatus(String status) { this.status = status; }
}

