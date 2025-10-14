package com.eventos.application.usecase.notification;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;
import com.eventos.infrastructure.email.SimpleTemplateEngine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class InscriptionEmailFactory {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm", Locale.getDefault());

    // Configurables por properties:
    @Value("${app.mail.templates.inscripcion.headerImageUrl:https://images.unsplash.com/photo-1503265192943-9d7eea6fc1fd?q=80&w=1280&fit=crop}")
    private String defaultHeaderImageUrl;

    @Value("${app.web.eventBaseUrl:https://tusitio.com/eventos/}")
    private String eventBaseUrl;

    public String subject(Event event) {
        String nombre = event != null && event.getNombre() != null ? event.getNombre() : "Evento";
        return "Inscripción confirmada – " + nombre;
    }

    /** Genera el HTML final de confirmación de inscripción */
    public String buildHtml(Event event,
                            Inscription inscription,
                            String participanteNombre,
                            String headerImageUrlOverride,
                            String ctaUrlOverride) {

        String headerImage = (headerImageUrlOverride != null && !headerImageUrlOverride.isBlank())
                ? headerImageUrlOverride : defaultHeaderImageUrl;

        String cta = (ctaUrlOverride != null && !ctaUrlOverride.isBlank())
                ? ctaUrlOverride
                : (event != null && event.getId() != null ? eventBaseUrl + event.getId() : eventBaseUrl);

        Map<String, String> vars = new HashMap<>();
        vars.put("HEADER_IMAGE_URL", headerImage);
        vars.put("EVENTO_NOMBRE", event != null && event.getNombre() != null ? event.getNombre() : "Evento");
        vars.put("EVENTO_DESCRIPCION", event != null && event.getDescripcion() != null ? event.getDescripcion() : "");
        vars.put("EVENTO_UBICACION", event != null && event.getUbicacion() != null ? event.getUbicacion() : "");
        vars.put("EVENTO_INICIO", event != null && event.getFechaInicio() != null ? FMT.format(event.getFechaInicio()) : "Por confirmar");
        vars.put("EVENTO_FIN", event != null && event.getFechaFin() != null ? FMT.format(event.getFechaFin()) : "Por confirmar");
        vars.put("INSCRIPCION_ID", inscription != null && inscription.getId() != null ? inscription.getId() : "");
        vars.put("PARTICIPANTE_NOMBRE", participanteNombre != null ? participanteNombre : "");
        vars.put("CTA_URL", cta);

        return SimpleTemplateEngine.renderFromClasspath("templates/email/inscripcion.html", vars);
    }
}

