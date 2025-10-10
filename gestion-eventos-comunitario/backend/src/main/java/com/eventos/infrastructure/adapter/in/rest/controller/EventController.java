package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.CreateEventUseCase;
import com.eventos.domain.model.Event;
import com.eventos.domain.model.EventStatus;
import com.eventos.domain.port.out.EventRepository;
import com.eventos.infrastructure.adapter.in.rest.dto.ApiResponse;
import com.eventos.infrastructure.adapter.in.rest.dto.EventRequest;
import com.eventos.infrastructure.adapter.in.rest.dto.EventResponse;
import com.eventos.infrastructure.adapter.in.rest.mapper.EventDTOMapper;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller para gestión de eventos
 * Adaptador de entrada (Puerto de entrada HTTP)
 */
@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
@Tag(name = "Eventos", description = "API para gestión de eventos comunitarios")
public class EventController {

    private final CreateEventUseCase createEventUseCase;
    private final EventRepository eventRepository;
    private final EventDTOMapper eventMapper;

    public EventController(CreateEventUseCase createEventUseCase,
                           EventRepository eventRepository,
                           EventDTOMapper eventMapper) {
        this.createEventUseCase = createEventUseCase;
        this.eventRepository = eventRepository;
        this.eventMapper = eventMapper;
    }

    /**
     * POST /api/eventos - Crear nuevo evento
     */
    @Operation(
            summary = "Crear nuevo evento",
            description = "Registra un nuevo evento comunitario en el sistema. El evento se crea con estado PENDIENTE_APROBACION."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "Evento creado exitosamente",
                    content = @Content(schema = @Schema(implementation = EventResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Datos inválidos"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Datos del evento a crear",
                    required = true
            )
            @Valid @RequestBody EventRequest request) {

        var command = new CreateEventUseCase.CreateEventCommand(
                request.getNombre(),
                request.getDescripcion(),
                request.getFechaInicio(),
                request.getFechaFin(),
                request.getUbicacion(),
                request.getCapacidadMaxima(),
                request.getOrganizador(),
                request.getPresupuestoSolicitado()
        );

        Event event = createEventUseCase.execute(command);
        EventResponse response = eventMapper.toResponse(event);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Evento creado exitosamente"));
    }

    /**
     * GET /api/eventos - Obtener todos los eventos
     */
    @Operation(
            summary = "Listar todos los eventos",
            description = "Obtiene la lista completa de eventos registrados en el sistema"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        List<Event> events = eventRepository.findAll();

        List<EventResponse> responses = events.stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Eventos obtenidos exitosamente")
        );
    }

    /**
     * GET /api/eventos/{id} - Obtener evento por ID
     */
    @Operation(
            summary = "Obtener evento por ID",
            description = "Consulta la información detallada de un evento específico"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @Parameter(description = "ID único del evento", required = true)
            @PathVariable String id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado con ID: " + id));

        EventResponse response = eventMapper.toResponse(event);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Evento encontrado")
        );
    }

    /**
     * GET /api/eventos/status/{status} - Obtener eventos por estado
     */
    @Operation(
            summary = "Filtrar eventos por estado",
            description = "Obtiene eventos filtrados por su estado actual"
    )
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByStatus(
            @Parameter(description = "Estado del evento", required = true)
            @PathVariable EventStatus status) {

        List<Event> events = eventRepository.findByStatus(status);

        List<EventResponse> responses = events.stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Eventos filtrados por estado: " + status.getDescripcion())
        );
    }

    /**
     * GET /api/eventos/calendario - Obtener eventos próximos (calendario)
     */
    @Operation(
            summary = "Obtener calendario de eventos",
            description = "Muestra los eventos próximos de los siguientes 3 meses"
    )
    @GetMapping("/calendario")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime futureDate = now.plusMonths(3);

        List<Event> events = eventRepository.findByDateRange(now, futureDate);

        List<EventResponse> responses = events.stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Calendario de eventos próximos")
        );
    }

    /**
     * GET /api/eventos/organizador/{organizador} - Obtener eventos por organizador
     */
    @Operation(
            summary = "Buscar eventos por organizador",
            description = "Filtra eventos según el nombre del organizador"
    )
    @GetMapping("/organizador/{organizador}")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByOrganizer(
            @Parameter(description = "Nombre del organizador", required = true)
            @PathVariable String organizador) {

        List<Event> events = eventRepository.findByOrganizador(organizador);

        List<EventResponse> responses = events.stream()
                .map(eventMapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.success(responses, "Eventos del organizador: " + organizador)
        );
    }

    /**
     * DELETE /api/eventos/{id} - Cancelar evento
     */
    @Operation(
            summary = "Cancelar evento",
            description = "Cambia el estado de un evento a CANCELADO"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> cancelEvent(
            @Parameter(description = "ID del evento a cancelar", required = true)
            @PathVariable String id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento no encontrado"));

        event.cancelarEvento();
        Event updatedEvent = eventRepository.save(event);

        EventResponse response = eventMapper.toResponse(updatedEvent);

        return ResponseEntity.ok(
                ApiResponse.success(response, "Evento cancelado exitosamente")
        );
    }
}