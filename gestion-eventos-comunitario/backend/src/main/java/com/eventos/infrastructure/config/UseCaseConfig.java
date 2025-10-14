package com.eventos.infrastructure.config;

import com.eventos.application.usecase.CancelEventUseCase;
import com.eventos.application.usecase.RegisterInscriptionUseCase;
import com.eventos.application.usecase.UpdateEventUseCase;
import com.eventos.application.usecase.notification.EventCanceledEmailFactory;
import com.eventos.application.usecase.notification.EventUpdatedEmailFactory;
import com.eventos.application.usecase.notification.InscriptionEmailFactory;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import com.eventos.domain.port.out.NotificationPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public RegisterInscriptionUseCase registerInscriptionUseCase(
            EventRepository eventRepository,
            InscriptionRepository inscriptionRepository,
            NotificationPort notificationPort,
            InscriptionEmailFactory inscriptionEmailFactory
    ) {
        return new RegisterInscriptionUseCase(eventRepository, inscriptionRepository, notificationPort, inscriptionEmailFactory);
    }

    @Bean
    public UpdateEventUseCase updateEventUseCase(EventRepository eventRepository,
                                                 InscriptionRepository inscriptionRepository,
                                                 NotificationPort notificationPort,
                                                 EventUpdatedEmailFactory emailFactory) {
        return new UpdateEventUseCase(eventRepository, inscriptionRepository, notificationPort, emailFactory);
    }

    @Bean
    public CancelEventUseCase cancelEventUseCase(EventRepository eventRepository,
                                                 InscriptionRepository inscriptionRepository,
                                                 NotificationPort notificationPort,
                                                 EventCanceledEmailFactory emailFactory) {
        return new CancelEventUseCase(eventRepository, inscriptionRepository, notificationPort, emailFactory);
    }
}
