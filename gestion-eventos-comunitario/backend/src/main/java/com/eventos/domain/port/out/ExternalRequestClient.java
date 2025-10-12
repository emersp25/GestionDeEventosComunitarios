package com.eventos.domain.port.out;

import com.eventos.infrastructure.adapter.in.rest.dto.ExternalApiEnvelope;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalRequestItem;
import com.eventos.infrastructure.adapter.in.rest.dto.RequestForwardRequest;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;

public interface ExternalRequestClient {

    /**
     * Autentica contra el servicio externo y retorna el JWT
     */
    String authenticate();

    /**
     * Envía la solicitud al servicio externo usando el token obtenido.
     * Devuelve la respuesta cruda como JsonNode para flexibilidad.
     */
    JsonNode forwardRequest(RequestForwardRequest request);

    ExternalApiEnvelope<List<ExternalRequestItem>> fetchRequests();
}
