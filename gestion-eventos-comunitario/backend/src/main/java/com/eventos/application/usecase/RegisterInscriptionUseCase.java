package com.eventos.application.usecase;

import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/*
* Caso de Uso: Gestionar Inscripciones
*/
@Service
public class RegisterInscriptionUseCase {
    private final InscriptionRepository inscriptionRepository;
    private final EventRepository eventRepository;

    public RegisterInscriptionUseCase(InscriptionRepository inscriptionRepository,
                                      EventRepository eventRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Inscription execute(RegisterInscriptionCommand command) {
        validateCommand(command);

        // Buscar el evento
        Event event = eventRepository.findById(command.eventId())
                .orElseThrow(() -> new IllegalArgumentException("El evento no existe"));

        // Validar que el evento esté aprobado
        if (event.getStatus() != EventStatus.APROBADO) {
            throw new IllegalStateException("Solo se puede inscribir a eventos aprobados");
        }

        // Validar capacidad
        if (!event.tieneCuposDisponibles()) {
            throw new IllegalStateException("El evento ha alcanzado su capacidad máxima");
        }

        // Crear inscripción
        Inscription inscription = new Inscription(
                command.eventId(),
                command.participanteNombre(),
                command.participanteEmail(),
                command.participanteTelefono(),
                command.notasAdicionales()
        );

        // Guardar inscripción
        inscription = inscriptionRepository.save(inscription);

        // Agregar inscripción al evento
        event.agregarInscripcion(inscription.getId());
        eventRepository.save(event);

        return inscription;
    }

    private void validateCommand(RegisterInscriptionCommand command) {
        if (command.eventId() == null || command.eventId().trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del evento es requerido");
        }

        if (command.participanteNombre() == null || command.participanteNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del participante es requerido");
        }

        if (command.participanteEmail() == null || command.participanteEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email del participante es requerido");
        }

        if (!isValidEmail(command.participanteEmail())) {
            throw new IllegalArgumentException("El email del participante no es válido");
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }

    public record RegisterInscriptionCommand(
            String eventId,
            String participanteNombre,
            String participanteEmail,
            String participanteTelefono,
            String notasAdicionales
    ) {}
}
