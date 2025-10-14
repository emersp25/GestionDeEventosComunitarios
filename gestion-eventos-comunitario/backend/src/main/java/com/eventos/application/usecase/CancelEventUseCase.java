package com.eventos.application.usecase;

import com.eventos.application.usecase.notification.EventCanceledEmailFactory;
import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import com.eventos.domain.port.out.NotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;

public class CancelEventUseCase {

    private static final Logger log = LoggerFactory.getLogger(CancelEventUseCase.class);

    private final EventRepository eventRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NotificationPort notificationPort;
    private final EventCanceledEmailFactory emailFactory;

    public CancelEventUseCase(EventRepository eventRepository,
                              InscriptionRepository inscriptionRepository,
                              NotificationPort notificationPort,
                              EventCanceledEmailFactory emailFactory) {
        this.eventRepository = Objects.requireNonNull(eventRepository);
        this.inscriptionRepository = Objects.requireNonNull(inscriptionRepository);
        this.notificationPort = Objects.requireNonNull(notificationPort);
        this.emailFactory = Objects.requireNonNull(emailFactory);
    }

    public Event cancel(String eventId) {
        if (eventId == null || eventId.isBlank())
            throw new IllegalArgumentException("eventId no puede ser nulo o vacío");

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado: " + eventId));

        boolean alreadyCanceled = (event.getStatus() == EventStatus.CANCELADO);
        if (!alreadyCanceled) {
            event.cancelarEvento(); // dominio ya valida y setea fechaActualizacion
            event = eventRepository.save(event);
        }

        // Notificar a inscritos (solo una vez si estaba ya cancelado? tú decides; aquí notificamos siempre)
        List<Inscription> inscriptions = inscriptionRepository.findByEventId(event.getId());
        List<String> recipients = inscriptions.stream()
                .map(Inscription::getParticipanteEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .toList();

        if (!recipients.isEmpty()) {
            String subject = emailFactory.subject(event);
            String html = emailFactory.buildHtml(event);
            log.debug("[cancel-event] Notificando a {} destinatarios", recipients.size());
            notificationPort.sendHtmlBulk(recipients, subject, html);
        } else {
            log.debug("[cancel-event] No hay destinatarios para notificar");
        }

        return event;
    }
}

