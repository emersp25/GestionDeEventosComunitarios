package com.eventos.infrastructure.adapter.in.rest.dto.report;

import java.math.BigDecimal;

public class TotalesReportResponse {
    private long totalEventosRealizados;
    private long totalParticipantes;
    private BigDecimal presupuestoEjecutado;

    public TotalesReportResponse() {}

    public TotalesReportResponse(long totalEventosRealizados, long totalParticipantes, BigDecimal presupuestoEjecutado) {
        this.totalEventosRealizados = totalEventosRealizados;
        this.totalParticipantes = totalParticipantes;
        this.presupuestoEjecutado = presupuestoEjecutado;
    }

    public long getTotalEventosRealizados() { return totalEventosRealizados; }
    public long getTotalParticipantes() { return totalParticipantes; }
    public BigDecimal getPresupuestoEjecutado() { return presupuestoEjecutado; }

    public void setTotalEventosRealizados(long totalEventosRealizados) { this.totalEventosRealizados = totalEventosRealizados; }
    public void setTotalParticipantes(long totalParticipantes) { this.totalParticipantes = totalParticipantes; }
    public void setPresupuestoEjecutado(BigDecimal presupuestoEjecutado) { this.presupuestoEjecutado = presupuestoEjecutado; }
}
