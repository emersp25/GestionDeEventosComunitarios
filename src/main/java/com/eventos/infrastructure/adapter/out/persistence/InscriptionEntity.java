package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.InscriptionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/*
 * Entidad JPA para persistencia de Inscription
 * Adaptador de salida - Infraestructura
*/
@Entity
@Table(name = "inscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionEntity {
    @Id
    private String id;

    @Column(nullable = false)
    private String eventId;

    @Column(nullable = false, length = 200)
    private String participanteNombre;

    @Column(nullable = false, length = 200)
    private String participanteEmail;

    @Column(length = 20)
    private String participanteTelefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InscriptionStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaInscripcion;

    @Column(length = 500)
    private String notasAdicionales;

    @PrePersist
    protected void onCreate() {
        if (fechaInscripcion == null) {
            fechaInscripcion = LocalDateTime.now();
        }
    }
}
