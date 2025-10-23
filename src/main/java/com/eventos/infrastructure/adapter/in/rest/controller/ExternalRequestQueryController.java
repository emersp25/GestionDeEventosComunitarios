package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.ListExternalRequestsUseCase;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalApiEnvelope;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalRequestItem;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/event/requests")
@CrossOrigin(origins = "*")
@Tag(name = "External Requests Query", description = "Consulta de solicitudes desde API externa con filtro originId=1")
public class ExternalRequestQueryController {

    private final ListExternalRequestsUseCase useCase;

    public ExternalRequestQueryController(ListExternalRequestsUseCase useCase) {
        this.useCase = useCase;
    }

    @Operation(summary = "Listar solicitudes (originId=1)")
    @GetMapping
    public ResponseEntity<ExternalApiEnvelope<List<ExternalRequestItem>>> list() {
        ExternalApiEnvelope<List<ExternalRequestItem>> envelope = useCase.execute(1);
        return ResponseEntity.ok(envelope);
    }
}

