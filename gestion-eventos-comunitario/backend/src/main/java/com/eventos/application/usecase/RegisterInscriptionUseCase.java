package com.eventos.application.usecase;

import com.eventos.application.usecase.notification.InscriptionEmailFactory;
import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import com.eventos.domain.port.out.NotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

public class RegisterInscriptionUseCase {

    private static final Logger log = LoggerFactory.getLogger(RegisterInscriptionUseCase.class);

    private final EventRepository eventRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NotificationPort notificationPort;
    private final InscriptionEmailFactory emailFactory;

    public record RegisterInscriptionCommand(
            String eventId,
            String participanteNombre,
            String participanteEmail,
            String participanteTelefono,
            String notasAdicionales
    ) {}

    public RegisterInscriptionUseCase(EventRepository eventRepository,
                                      InscriptionRepository inscriptionRepository,
                                      NotificationPort notificationPort,
                                      InscriptionEmailFactory emailFactory) {
        this.eventRepository = Objects.requireNonNull(eventRepository);
        this.inscriptionRepository = Objects.requireNonNull(inscriptionRepository);
        this.notificationPort = Objects.requireNonNull(notificationPort);
        this.emailFactory = Objects.requireNonNull(emailFactory);
    }

    public Inscription execute(RegisterInscriptionCommand cmd) {
        Event event = eventRepository.findById(cmd.eventId())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado: " + cmd.eventId()));

        Inscription toSave = new Inscription(
                /* id según tu implementación */
                cmd.eventId(),
                cmd.participanteNombre(),
                cmd.participanteEmail(),
                cmd.participanteTelefono(),
                cmd.notasAdicionales()
        );

        Inscription saved = inscriptionRepository.save(toSave);
        log.debug("[register] guardado id={}, email={}", saved.getId(), cmd.participanteEmail());

        // --- Email HTML usando la fábrica ---
        String to = cmd.participanteEmail();
        if (to == null || to.isBlank()) {
            log.warn("[register] Email vacío/nulo; no se enviará notificación.");
            return saved;
        }

        try {
            String subject = emailFactory.subject(event);
            // Si quieres forzar otra imagen/CTA pásalas; si no, null usa los defaults
            String html = emailFactory.buildHtml(event, saved, cmd.participanteNombre(), null, null);
            notificationPort.sendHtml(to, subject, html);
            log.debug("[register] Email HTML enviado a {}", to);
        } catch (Exception ex) {
            log.error("[register] Error enviando correo HTML", ex);
        }

        return saved;
    }
}
