package com.eventos.domain.port.out;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/*
 -Puerto de salida - Patrón Repository
 -Interface que define el contrato para persistencia de eventos
*/

public interface EventRepository {
    Event save(Event event);

    Optional<Event> findById(String id);

    List<Event> findAll();

    List<Event> findByStatus(EventStatus status);

    List<Event> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<Event> findByOrganizador(String organizador);

    void deleteById(String id);

    boolean existsById(String id);
}
