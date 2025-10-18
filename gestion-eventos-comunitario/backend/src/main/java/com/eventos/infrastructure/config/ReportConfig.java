package com.eventos.infrastructure.config;

import com.eventos.application.usecase.ReportQueryUseCase;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReportConfig {

    @Bean
    public ReportQueryUseCase reportQueryUseCase(EventRepository eventRepository,
                                                 InscriptionRepository inscriptionRepository) {
        return new ReportQueryUseCase(eventRepository, inscriptionRepository);
    }
}
