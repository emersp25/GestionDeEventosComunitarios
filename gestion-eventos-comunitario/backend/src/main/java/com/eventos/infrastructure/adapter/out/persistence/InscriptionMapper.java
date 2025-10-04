package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.Inscription;
import org.springframework.stereotype.Component;

/*
 * Mapper entre entidad de dominio (Inscription) y entidad JPA (InscriptionEntity)
 * Parte del adaptador de salid
*/
@Component
public class InscriptionMapper {
    /**
     * Convierte de dominio a entidad JPA
     */
    public InscriptionEntity toEntity(Inscription inscription) {
        if (inscription == null) {
            return null;
        }

        return new InscriptionEntity(
                inscription.getId(),
                inscription.getEventId(),
                inscription.getParticipanteNombre(),
                inscription.getParticipanteEmail(),
                inscription.getParticipanteTelefono(),
                inscription.getStatus(),
                inscription.getFechaInscripcion(),
                inscription.getNotasAdicionales()
        );
    }

    /**
     * Convierte de entidad JPA a dominio
     */
    public Inscription toDomain(InscriptionEntity entity) {
        if (entity == null) {
            return null;
        }

        return new Inscription(
                entity.getId(),
                entity.getEventId(),
                entity.getParticipanteNombre(),
                entity.getParticipanteEmail(),
                entity.getParticipanteTelefono(),
                entity.getStatus(),
                entity.getFechaInscripcion(),
                entity.getNotasAdicionales()
        );
    }
}
