package com.eventos.domain.port.out;

import com.eventos.domain.model.Inscription;
import com.eventos.domain.model.InscriptionStatus;

import java.util.List;
import java.util.Optional;

/*
 * Puerto de salida - Patrón Repository
 * Interface que define el contrato para persistencia de inscripciones
*/

public interface InscriptionRepository {
    Inscription save(Inscription inscription);

    Optional<Inscription> findById(String id);

    List<Inscription> findAll();

    List<Inscription> findByEventId(String eventId);

    List<Inscription> findByEmail(String email);

    List<Inscription> findByEventIdAndStatus(String eventId, InscriptionStatus status);

    void deleteById(String id);

    int countByEventId(String eventId);
}
