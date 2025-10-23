package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.InscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Spring Data JPA Repository para InscriptionEntity
 * Adaptador de salida - Infraestructura
*/
@Repository
public interface InscriptionJpaRepository extends JpaRepository<InscriptionEntity, String> {

    List<InscriptionEntity> findByEventId(String eventId);

    List<InscriptionEntity> findByParticipanteEmail(String email);

    List<InscriptionEntity> findByEventIdAndStatus(String eventId, InscriptionStatus status);

    int countByEventId(String eventId);
}
