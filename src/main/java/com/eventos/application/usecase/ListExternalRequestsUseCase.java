package com.eventos.application.usecase;

import com.eventos.domain.port.out.ExternalRequestClient;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalApiEnvelope;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalRequestItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class ListExternalRequestsUseCase {

    private final ExternalRequestClient client;

    public ListExternalRequestsUseCase(ExternalRequestClient client) {
        this.client = client;
    }

    public ExternalApiEnvelope<List<ExternalRequestItem>> execute(Integer originId) {
        ExternalApiEnvelope<List<ExternalRequestItem>> envelope = client.fetchRequests();

        boolean success = envelope != null && envelope.isSuccess();
        String message = envelope != null ? envelope.getMessage() : "Respuesta vacía del servicio externo";
        List<ExternalRequestItem> data = (envelope != null && envelope.getData() != null)
                ? envelope.getData()
                : new ArrayList<>();

        List<ExternalRequestItem> filtered = data.stream()
                .filter(Objects::nonNull)
                .filter(item -> item.getOriginId() != null && item.getOriginId().equals(originId))
                .toList();

        return new ExternalApiEnvelope<>(success, message, filtered, filtered.size());
    }
}

