package com.eventos.infrastructure.adapter.out.http;

import com.eventos.domain.port.out.ExternalRequestClient;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalApiEnvelope;
import com.eventos.infrastructure.adapter.in.rest.dto.ExternalRequestItem;
import com.eventos.infrastructure.adapter.in.rest.dto.RequestForwardRequest;
import com.eventos.infrastructure.config.ExternalApiProperties;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Component
public class WebClientExternalRequestClient implements ExternalRequestClient {

    private final RestTemplate restTemplate;
    private final ExternalApiProperties props;

    public WebClientExternalRequestClient(RestTemplate externalRestTemplate, ExternalApiProperties props) {
        this.restTemplate = externalRestTemplate;
        this.props = props;
    }

    @Override
    public String authenticate() {
        String url = props.getBaseUrl() + "/Auth";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of(
                "userName", props.getUsername(),
                "password", props.getPassword()
        );
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, JsonNode.class
        );

        JsonNode json = response.getBody();
        if (json == null) {
            throw new IllegalStateException("Respuesta nula al autenticar contra API externa");
        }

        String token = extractToken(json);
        if (token == null || token.isBlank()) {
            throw new IllegalStateException("No se obtuvo token JWT desde la API externa: " + json);
        }
        return token;
    }

    private String extractToken(JsonNode json) {
        // 1) Campos a nivel raíz
        if (json.hasNonNull("token")) return json.get("token").asText();
        if (json.hasNonNull("accessToken")) return json.get("accessToken").asText();
        if (json.hasNonNull("jwt")) return json.get("jwt").asText();
        if (json.hasNonNull("access_token")) return json.get("access_token").asText();

        // 2) Token anidado en 'data'
        JsonNode data = json.path("data");
        if (data != null && !data.isMissingNode()) {
            if (data.hasNonNull("token")) return data.get("token").asText();
            if (data.hasNonNull("accessToken")) return data.get("accessToken").asText();
            if (data.hasNonNull("jwt")) return data.get("jwt").asText();
            if (data.hasNonNull("access_token")) return data.get("access_token").asText();
        }
        return null;
    }

    @Override
    public JsonNode forwardRequest(RequestForwardRequest request) throws RestClientResponseException {
        String token = authenticate();
        String url = props.getBaseUrl() + "/Request";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<RequestForwardRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<JsonNode> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, JsonNode.class
        );
        return response.getBody();
    }

    @Override
    public ExternalApiEnvelope<List<ExternalRequestItem>> fetchRequests() throws RestClientResponseException {
        String token = authenticate();

        URI uri = UriComponentsBuilder
                .fromHttpUrl(props.getBaseUrl() + "/Request")
                .queryParam("PageNumber", 1)
                .queryParam("PageSize", 30)
                .queryParam("IncludeTotal", false)
                .build(true)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(List.of(MediaType.TEXT_PLAIN, MediaType.APPLICATION_JSON));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<ExternalApiEnvelope<List<ExternalRequestItem>>> response = restTemplate.exchange(
                uri,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<ExternalApiEnvelope<List<ExternalRequestItem>>>() {}
        );

        return response.getBody();
    }
}
