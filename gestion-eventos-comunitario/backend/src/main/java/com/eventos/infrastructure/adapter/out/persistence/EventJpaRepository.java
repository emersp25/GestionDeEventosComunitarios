package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/*
 * Spring Data JPA Repository para EventEntity
 * Adaptador de salida - Infraestructura
*/
@Repository
public interface EventJpaRepository extends JpaRepository<EventEntity, String>{
    List<EventEntity> findByStatus(EventStatus status);

    @Query("SELECT e FROM EventEntity e WHERE e.fechaInicio >= :startDate AND e.fechaFin <= :endDate")
    List<EventEntity> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    List<EventEntity> findByOrganizador(String organizador);

    @Query("SELECT e FROM EventEntity e WHERE e.status = :status AND e.fechaInicio >= :currentDate ORDER BY e.fechaInicio ASC")
    List<EventEntity> findUpcomingEventsByStatus(
            @Param("status") EventStatus status,
            @Param("currentDate") LocalDateTime currentDate
    );

    @Query("SELECT e FROM EventEntity e WHERE e.fechaInicio >= :currentDate ORDER BY e.fechaInicio ASC")
    List<EventEntity> findUpcomingEvents(@Param("currentDate") LocalDateTime currentDate);


}
