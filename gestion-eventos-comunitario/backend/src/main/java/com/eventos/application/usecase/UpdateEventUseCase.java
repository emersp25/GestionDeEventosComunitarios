package com.eventos.application.usecase;

import com.eventos.application.usecase.notification.EventUpdatedEmailFactory;
import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import com.eventos.domain.port.out.NotificationPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;

public class UpdateEventUseCase {

    private static final Logger log = LoggerFactory.getLogger(UpdateEventUseCase.class);

    private final EventRepository eventRepository;
    private final InscriptionRepository inscriptionRepository;
    private final NotificationPort notificationPort;
    private final EventUpdatedEmailFactory emailFactory;

    public record UpdateEventCommand(
            String id,
            String nombre,
            String descripcion,
            java.time.LocalDateTime fechaInicio,
            java.time.LocalDateTime fechaFin,
            String ubicacion,
            Integer capacidadMaxima,
            String estado
    ) {}

    public UpdateEventUseCase(EventRepository eventRepository,
                              InscriptionRepository inscriptionRepository,
                              NotificationPort notificationPort,
                              EventUpdatedEmailFactory emailFactory) {
        this.eventRepository = Objects.requireNonNull(eventRepository);
        this.inscriptionRepository = Objects.requireNonNull(inscriptionRepository);
        this.notificationPort = Objects.requireNonNull(notificationPort);
        this.emailFactory = Objects.requireNonNull(emailFactory);
    }

    public Event execute(UpdateEventCommand cmd) {
        // 1) Cargar y actualizar por comportamiento de dominio
        Event event = eventRepository.findById(cmd.id())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado: " + cmd.id()));
        event.actualizarInformacion(cmd.nombre(), cmd.descripcion(), cmd.fechaInicio(), cmd.fechaFin(), cmd.ubicacion(), cmd.estado());
        event.actualizarCapacidadMaxima(cmd.capacidadMaxima());

        // 2) Persistir cambios
        Event saved = eventRepository.save(event);

        // 3) Notificar a inscritos
        List<Inscription> inscriptions = inscriptionRepository.findByEventId(saved.getId());
        List<String> recipients = inscriptions.stream()
                .map(Inscription::getParticipanteEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .toList();

        if (!recipients.isEmpty()) {
            String subject = emailFactory.subject(saved);
            String html = emailFactory.buildHtml(saved);
            log.debug("[update-event] Notificando a {} destinatarios", recipients.size());
            notificationPort.sendHtmlBulk(recipients, subject, html);
        } else {
            log.debug("[update-event] No hay destinatarios para notificar");
        }

        return saved;
    }
}
