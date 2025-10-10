package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.RegisterInscriptionUseCase;
import com.eventos.domain.model.Event;
import com.eventos.domain.model.Inscription;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.domain.port.out.InscriptionRepository;
import com.eventos.infrastructure.adapter.in.rest.dto.ApiResponse;
import com.eventos.infrastructure.adapter.in.rest.dto.InscriptionRequest;
import com.eventos.infrastructure.adapter.in.rest.dto.InscriptionResponse;
import com.eventos.infrastructure.adapter.in.rest.mapper.InscriptionDTOMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller para gestión de inscripciones
 * Adaptador de entrada (Puerto de entrada HTTP)
 */
@RestController
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "*")
@Tag(name = "Inscripciones", description = "API para gestión de inscripciones a eventos")
public class InscriptionController {

    private final RegisterInscriptionUseCase registerInscriptionUseCase;
    private final InscriptionRepository inscriptionRepository;
    private final EventRepository eventRepository;
    private final InscriptionDTOMapper inscriptionMapper;

    public InscriptionController(RegisterInscriptionUseCase registerInscriptionUseCase,
                                 InscriptionRepository inscriptionRepository,
                                 EventRepository eventRepository,
                                 InscriptionDTOMapper inscriptionMapper) {
        this.registerInscriptionUseCase = registerInscriptionUseCase;
        this.inscriptionRepository = inscriptionRepository;
        this.eventRepository = eventRepository;
        this.inscriptionMapper = inscriptionMapper;
    }

    /**
     * POST /api/inscripciones - Registrar nueva inscripción
     */
    @Operation(
            summary = "Registrar nueva inscripción",
            description = "Registra a un participante en un evento. El evento debe estar en estado APROBADO y tener cupos disponibles."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Inscripción registrada exitosamente",
                    content = @Content(schema = @Schema(implementation = InscriptionResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Datos inválidos o evento no aprobado"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Conflicto - El evento está lleno"
            )
    })
    @PostMapping
    public ResponseEntity<ApiResponse<InscriptionResponse>> registerInscription(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del participante a inscribir",
                    required = true
            )
            @Valid @RequestBody InscriptionRequest request) {

        var command = new RegisterInscriptionUseCase.RegisterInscriptionCommand(
                request.getEventId(),
                request.getParticipanteNombre(),
                request.getParticipanteEmail(),
                request.getParticipanteTelefono(),
                request.getNotasAdicionales()
        );

        Inscription inscription = registerInscriptionUseCase.execute(command);

        Event event = eventRepository.findById(inscription.getEventId()).orElse(null);
        InscriptionResponse response = inscriptionMapper.toResponse(inscription, event);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Inscripción registrada exitosamente"));
    }

    /**
     * GET /api/inscripciones - Obtener todas las inscripciones
     */
    @Operation(
            summary = "Listar todas las inscripciones",
            description = "Obtiene el listado completo de inscripciones registradas en el sistema"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<InscriptionResponse>>> getAllInscriptions() {
        List<Inscription> inscriptions = inscriptionRepository.findAll();

        List<InscriptionResponse> responses = inscriptions.stream()
                .map(inscriptionMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Inscripciones obtenidas exitosamente")
        );
    }

    /**
     * GET /api/inscripciones/{id} - Obtener inscripción por ID
     */
    @Operation(
            summary = "Obtener inscripción por ID",
            description = "Consulta los detalles de una inscripción específica"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InscriptionResponse>> getInscriptionById(
            @Parameter(description = "ID único de la inscripción", required = true)
            @PathVariable String id) {

        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada"));

        Event event = eventRepository.findById(inscription.getEventId()).orElse(null);
        InscriptionResponse response = inscriptionMapper.toResponse(inscription, event);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Inscripción encontrada")
        );
    }

    /**
     * GET /api/inscripciones/evento/{eventId} - Obtener inscripciones por evento
     */
    @Operation(
            summary = "Listar inscripciones de un evento",
            description = "Obtiene todas las inscripciones asociadas a un evento específico"
    )
    @GetMapping("/evento/{eventId}")
    public ResponseEntity<ApiResponse<List<InscriptionResponse>>> getInscriptionsByEvent(
            @Parameter(description = "ID del evento", required = true)
            @PathVariable String eventId) {

        List<Inscription> inscriptions = inscriptionRepository.findByEventId(eventId);
        Event event = eventRepository.findById(eventId).orElse(null);

        List<InscriptionResponse> responses = inscriptions.stream()
                .map(i -> inscriptionMapper.toResponse(i, event))
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Inscripciones del evento obtenidas")
        );
    }

    /**
     * GET /api/inscripciones/email/{email} - Obtener inscripciones por email
     */
    @Operation(
            summary = "Buscar inscripciones por email",
            description = "Obtiene todas las inscripciones de un participante usando su correo electrónico"
    )
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<List<InscriptionResponse>>> getInscriptionsByEmail(
            @Parameter(description = "Email del participante", required = true, example = "participante@email.com")
            @PathVariable String email) {

        List<Inscription> inscriptions = inscriptionRepository.findByEmail(email);

        List<InscriptionResponse> responses = inscriptions.stream()
                .map(inscriptionMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Inscripciones del participante obtenidas")
        );
    }

    /**
     * DELETE /api/inscripciones/{id} - Cancelar inscripción
     */
    @Operation(
            summary = "Cancelar inscripción",
            description = "Cambia el estado de una inscripción a CANCELADA y libera el cupo en el evento"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Inscripción cancelada exitosamente"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Inscripción no encontrada"
            )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<InscriptionResponse>> cancelInscription(
            @Parameter(description = "ID de la inscripción a cancelar", required = true)
            @PathVariable String id) {

        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada"));

        // Cancelar en el dominio
        inscription.cancelar();
        Inscription updatedInscription = inscriptionRepository.save(inscription);

        // También remover del evento
        Event event = eventRepository.findById(inscription.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));

        event.cancelarInscripcion(inscription.getId());
        eventRepository.save(event);

        InscriptionResponse response = inscriptionMapper.toResponse(updatedInscription, event);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Inscripción cancelada exitosamente")
        );
    }
}