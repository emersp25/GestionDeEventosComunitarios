package com.eventos.application.usecase;

import com.eventos.domain.port.out.ExternalRequestClient;
import com.eventos.infrastructure.adapter.in.rest.dto.RequestForwardRequest;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ForwardExternalRequestUseCase {

    private final ExternalRequestClient externalRequestClient;

    public ForwardExternalRequestUseCase(ExternalRequestClient externalRequestClient) {
        this.externalRequestClient = externalRequestClient;
    }

    public JsonNode execute(RequestForwardRequest request) {
        if (request.getRequestDate() == null) {
            request.setRequestDate(LocalDate.now());
        }
        return externalRequestClient.forwardRequest(request);
    }
}

