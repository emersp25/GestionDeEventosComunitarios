package com.eventos.application.usecase.notification;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class PlainTextEmailTemplates {
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm", Locale.getDefault());

    public static String subjectInscriptionConfirmed(Event event) {
        return "Inscripción confirmada – " + (event != null ? safe(event.getNombre()) : "Evento");
    }

    public static String bodyInscriptionConfirmed(Inscription insc, Event evt) {
        String nombre = safe(getParticipanteNombre(insc));
        String nombreEvento = evt != null ? safe(evt.getNombre()) : "Evento";
        String descripcion = evt != null ? safe(evt.getDescripcion()) : "";
        String lugar = evt != null ? safe(evt.getUbicacion()) : "";
        String inicio = evt != null && evt.getFechaInicio() != null ? FMT.format(evt.getFechaInicio()) : "Por confirmar";
        String fin = evt != null && evt.getFechaFin() != null ? FMT.format(evt.getFechaFin()) : "Por confirmar";

        return String.join("\n",
                "Hola " + nombre + ",",
                "",
                "Tu inscripción fue confirmada.",
                "",
                "Evento: " + nombreEvento,
                "Descripción: " + descripcion,
                "Lugar: " + lugar,
                "Inicio: " + inicio,
                "Fin: " + fin,
                "",
                "ID de inscripción: " + safe(getId(insc)),
                "",
                "¡Gracias por participar!"
        );
    }

    private static String safe(Object o) { return o == null ? "" : o.toString(); }

    // Helpers defensivos por si tus getters tienen otro nombre:
    private static String getParticipanteNombre(Inscription ins) {
        try { var m = ins.getClass().getMethod("getParticipanteNombre"); return String.valueOf(m.invoke(ins)); }
        catch (Exception ignore) { return ""; }
    }
    private static String getId(Inscription ins) {
        try { var m = ins.getClass().getMethod("getId"); return String.valueOf(m.invoke(ins)); }
        catch (Exception ignore) { return ""; }
    }
}
