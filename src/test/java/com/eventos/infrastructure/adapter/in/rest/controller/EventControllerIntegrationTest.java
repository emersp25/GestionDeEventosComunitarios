package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.domain.model.EventStatus;
import com.eventos.infrastructure.adapter.in.rest.dto.EventRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import org.springframework.transaction.annotation.Transactional;

/**
 * Pruebas de integración para EventController
 * Prueba la API REST completa con base de datos
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class EventControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private EventRequest validEventRequest;

    @BeforeEach
    void setUp() {
        validEventRequest = new EventRequest();
        validEventRequest.setNombre("Taller de Spring Boot");
        validEventRequest.setDescripcion("Aprende Spring Boot desde cero");
        validEventRequest.setFechaInicio(LocalDateTime.now().plusDays(1));
        validEventRequest.setFechaFin(LocalDateTime.now().plusDays(2));
        validEventRequest.setUbicacion("Auditorio Central");
        validEventRequest.setCapacidadMaxima(50);
        validEventRequest.setOrganizador("Juan Pérez");
        validEventRequest.setPresupuestoSolicitado(new BigDecimal("1500.00"));
    }

    @Test
    @DisplayName("Crear evento - Éxito")
    void testCreateEventSuccess() throws Exception {
        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.nombre").value("Taller de Spring Boot"))
                .andExpect(jsonPath("$.data.status").value("PENDIENTE_APROBACION"))
                .andExpect(jsonPath("$.data.cuposDisponibles").value(50));
    }

    @Test
    @DisplayName("Crear evento con datos inválidos")
    void testCreateEventWithInvalidData() throws Exception {
        EventRequest invalidRequest = new EventRequest();
        invalidRequest.setNombre(""); // Nombre vacío
        invalidRequest.setDescripcion("Test");
        invalidRequest.setFechaInicio(LocalDateTime.now().plusDays(1));
        invalidRequest.setFechaFin(LocalDateTime.now().plusDays(2));
        invalidRequest.setUbicacion("Lugar");
        invalidRequest.setCapacidadMaxima(10);
        invalidRequest.setOrganizador("Org");
        invalidRequest.setPresupuestoSolicitado(new BigDecimal("100"));

        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Listar todos los eventos - Lista vacía")
    void testGetAllEventsEmpty() throws Exception {
        mockMvc.perform(get("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    @DisplayName("Listar eventos - Con datos")
    void testGetAllEventsWithData() throws Exception {
        // Crear un evento primero
        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated());

        // Listar eventos
        mockMvc.perform(get("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].nombre").value("Taller de Spring Boot"));
    }

    @Test
    @DisplayName("Obtener evento por ID - Éxito")
    void testGetEventByIdSuccess() throws Exception {
        // Crear evento
        MvcResult createResult = mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        String eventId = objectMapper.readTree(responseBody).get("data").get("id").asText();

        // Obtener evento por ID
        mockMvc.perform(get("/api/eventos/" + eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(eventId))
                .andExpect(jsonPath("$.data.nombre").value("Taller de Spring Boot"));
    }

    @Test
    @DisplayName("Obtener evento por ID - No encontrado")
    void testGetEventByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/eventos/id-inexistente")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Filtrar eventos por estado - PENDIENTE_APROBACION")
    void testGetEventsByStatus() throws Exception {
        // Crear evento (estará en PENDIENTE_APROBACION)
        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated());

        // Filtrar por estado
        mockMvc.perform(get("/api/eventos/status/" + EventStatus.PENDIENTE_APROBACION)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    @Test
    @DisplayName("Obtener calendario de eventos")
    void testGetUpcomingEvents() throws Exception {
        // Crear evento
        mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated());

        // Obtener calendario
        mockMvc.perform(get("/api/eventos/calendario")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("Cancelar evento")
    void testCancelEvent() throws Exception {
        // Crear evento
        MvcResult createResult = mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validEventRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        String eventId = objectMapper.readTree(responseBody).get("data").get("id").asText();

        // Cancelar evento
        mockMvc.perform(delete("/api/eventos/" + eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELADO"));
    }
}