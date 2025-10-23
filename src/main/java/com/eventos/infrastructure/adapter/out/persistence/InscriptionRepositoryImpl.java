package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.Inscription;
import com.eventos.domain.model.InscriptionStatus;
import com.eventos.domain.port.out.InscriptionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del patrón Repository para Inscripciones
 * Adaptador de salida que conecta el dominio con JPA
 */
@Component
public class InscriptionRepositoryImpl implements InscriptionRepository {

    private final InscriptionJpaRepository jpaRepository;
    private final InscriptionMapper mapper;

    public InscriptionRepositoryImpl(InscriptionJpaRepository jpaRepository, InscriptionMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Inscription save(Inscription inscription) {
        InscriptionEntity entity = mapper.toEntity(inscription);
        InscriptionEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Inscription> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Inscription> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Inscription> findByEventId(String eventId) {
        return jpaRepository.findByEventId(eventId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Inscription> findByEmail(String email) {
        return jpaRepository.findByParticipanteEmail(email).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Inscription> findByEventIdAndStatus(String eventId, InscriptionStatus status) {
        return jpaRepository.findByEventIdAndStatus(eventId, status).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public int countByEventId(String eventId) {
        return jpaRepository.countByEventId(eventId);
    }
}
