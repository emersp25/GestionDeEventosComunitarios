package com.eventos.application.usecase;

import com.eventos.domain.port.out.ExternalRequestClient;
import com.eventos.infrastructure.adapter.in.rest.dto.RequestForwardRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class ForwardExternalRequestUseCaseTest {

    private ExternalRequestClient client;
    private ForwardExternalRequestUseCase useCase;
    private ObjectMapper mapper;

    @BeforeEach
    void setUp() {
        client = Mockito.mock(ExternalRequestClient.class);
        useCase = new ForwardExternalRequestUseCase(client);
        mapper = new ObjectMapper();
    }

    @Test
    void execute_should_autogenerate_requestDate_and_delegate_to_client() throws Exception {
        RequestForwardRequest req = new RequestForwardRequest();
        req.setOriginId(10);
        req.setRequestAmount(new BigDecimal("123.45"));
        req.setName("John Doe");
        req.setReason("Support");
        req.setRequestDate(null); // debe ser autogenerado
        req.setEmail("john@example.com");
        req.setPriorityId(2);

        JsonNode expected = mapper.readTree("{\"ok\":true}");
        when(client.forwardRequest(any(RequestForwardRequest.class))).thenReturn(expected);

        JsonNode result = useCase.execute(req);

        // Verificaciones
        assertThat(result).isEqualTo(expected);

        ArgumentCaptor<RequestForwardRequest> captor = ArgumentCaptor.forClass(RequestForwardRequest.class);
        verify(client, times(1)).forwardRequest(captor.capture());
        RequestForwardRequest sent = captor.getValue();
        assertThat(sent.getRequestDate()).isNotNull();
        assertThat(sent.getName()).isEqualTo("John Doe");
        assertThat(sent.getPriorityId()).isEqualTo(2);
    }
}

