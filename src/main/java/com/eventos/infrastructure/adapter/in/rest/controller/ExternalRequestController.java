package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.ForwardExternalRequestUseCase;
import com.eventos.infrastructure.adapter.in.rest.dto.ApiResponse;
import com.eventos.infrastructure.adapter.in.rest.dto.RequestForwardRequest;
import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/external/requests")
@CrossOrigin(origins = "*")
@Tag(name = "External Requests", description = "Encapsula autenticación y reenvío de solicitudes al servicio externo")
public class ExternalRequestController {

    private final ForwardExternalRequestUseCase useCase;

    public ExternalRequestController(ForwardExternalRequestUseCase useCase) {
        this.useCase = useCase;
    }

    @Operation(
            summary = "Enviar solicitud al servicio externo",
            description = "Autentica contra el endpoint /Auth para obtener JWT y reenvía el cuerpo al endpoint /Request con el token Bearer. Si requestDate no se envía, se genera automáticamente (YYYY-MM-DD)."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Solicitud reenviada exitosamente",
                    content = @Content(schema = @Schema(implementation = Object.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "502", description = "Error de pasarela al llamar servicio externo")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<JsonNode>> forward(@Valid @RequestBody RequestForwardRequest request) {
        JsonNode externalResponse = useCase.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(externalResponse, "Solicitud procesada y reenviada exitosamente"));
    }
}

