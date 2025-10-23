package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.EventStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/*
 * Entidad JPA para persistencia de Event
 * Adaptador de salida - Infraestructura
*/

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventEntity {
    @Id
    private String id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    @Column(nullable = false)
    private LocalDateTime fechaFin;

    @Column(length = 300)
    private String ubicacion;

    @Column(nullable = false)
    private Integer capacidadMaxima;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EventStatus status;

    @Column(precision = 10, scale = 2)
    private BigDecimal presupuestoSolicitado;

    @Column(precision = 10, scale = 2)
    private BigDecimal presupuestoAprobado;

    @Column(nullable = false, length = 200)
    private String organizador;

    @ElementCollection
    @CollectionTable(name = "event_inscripciones", joinColumns = @JoinColumn(name = "event_id"))
    @Column(name = "inscripcion_id")
    private List<String> inscripcionesIds = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (fechaActualizacion == null) {
            fechaActualizacion = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
