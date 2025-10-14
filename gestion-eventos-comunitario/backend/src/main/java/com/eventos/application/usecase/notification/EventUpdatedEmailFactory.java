package com.eventos.application.usecase.notification;

import com.eventos.domain.model.Event;
import com.eventos.infrastructure.email.SimpleTemplateEngine;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class EventUpdatedEmailFactory {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm", Locale.getDefault());

    public String subject(Event event) {
        String nombre = event != null && event.getNombre() != null ? event.getNombre() : "Evento";
        return "Actualización del evento – " + nombre;
    }

    public String buildHtml(Event event) {
        Map<String,String> vars = new HashMap<>();
        vars.put("EVENTO_NOMBRE", event != null && event.getNombre() != null ? event.getNombre() : "Evento");
        vars.put("EVENTO_DESCRIPCION", event != null && event.getDescripcion() != null ? event.getDescripcion() : "");
        vars.put("EVENTO_UBICACION", event != null && event.getUbicacion() != null ? event.getUbicacion() : "");
        vars.put("EVENTO_INICIO", event != null && event.getFechaInicio() != null ? FMT.format(event.getFechaInicio()) : "Por confirmar");
        vars.put("EVENTO_FIN", event != null && event.getFechaFin() != null ? FMT.format(event.getFechaFin()) : "Por confirmar");
        return SimpleTemplateEngine.renderFromClasspath("templates/email/evento_actualizado.html", vars);
    }
}
