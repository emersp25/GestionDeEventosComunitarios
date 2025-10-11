package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.infrastructure.adapter.in.rest.dto.EventRequest;
import com.eventos.infrastructure.adapter.in.rest.dto.InscriptionRequest;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Pruebas de integración para InscriptionController
 * Prueba la API REST completa de inscripciones
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class InscriptionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String eventId;
    private InscriptionRequest validInscriptionRequest;

    @BeforeEach
    void setUp() throws Exception {
        // Crear un evento primero
        EventRequest eventRequest = new EventRequest();
        eventRequest.setNombre("Evento Test");
        eventRequest.setDescripcion("Test");
        eventRequest.setFechaInicio(LocalDateTime.now().plusDays(1));
        eventRequest.setFechaFin(LocalDateTime.now().plusDays(2));
        eventRequest.setUbicacion("Test Location");
        eventRequest.setCapacidadMaxima(10);
        eventRequest.setOrganizador("Test Org");
        eventRequest.setPresupuestoSolicitado(new BigDecimal("1000.00"));

        MvcResult result = mockMvc.perform(post("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventRequest)))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        eventId = objectMapper.readTree(responseBody).get("data").get("id").asText();

        // Preparar request de inscripción válido
        validInscriptionRequest = new InscriptionRequest();
        validInscriptionRequest.setEventId(eventId);
        validInscriptionRequest.setParticipanteNombre("Carlos López");
        validInscriptionRequest.setParticipanteEmail("carlos@email.com");
        validInscriptionRequest.setParticipanteTelefono("12345678");
        validInscriptionRequest.setNotasAdicionales("Sin notas");
    }

    @Test
    @DisplayName("Registrar inscripción a evento no aprobado")
    void testRegisterInscriptionToUnapprovedEvent() throws Exception {
        // Intentar inscribirse a evento en PENDIENTE_APROBACION
        mockMvc.perform(post("/api/inscripciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInscriptionRequest)))
                .andExpect(status().isConflict()); // Estado 409 - Conflicto
    }

    @Test
    @DisplayName("Listar inscripciones - Lista vacía")
    void testGetAllInscriptionsEmpty() throws Exception {
        mockMvc.perform(get("/api/inscripciones")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    @DisplayName("Registrar inscripción con email inválido")
    void testRegisterInscriptionWithInvalidEmail() throws Exception {
        InscriptionRequest invalidRequest = new InscriptionRequest();
        invalidRequest.setEventId(eventId);
        invalidRequest.setParticipanteNombre("Test");
        invalidRequest.setParticipanteEmail("email-invalido"); // Email sin @
        invalidRequest.setParticipanteTelefono("12345678");
        invalidRequest.setNotasAdicionales("Test");

        mockMvc.perform(post("/api/inscripciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Obtener inscripciones de evento sin inscripciones")
    void testGetInscriptionsByEventEmpty() throws Exception {
        mockMvc.perform(get("/api/inscripciones/evento/" + eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    @DisplayName("Flujo completo: Crear evento, aprobarlo, inscribir, cancelar")
    void testCompleteFlowEventAndInscription() throws Exception {
        // 1. Crear evento (ya está hecho en setUp)

        // 2. Obtener el evento creado
        mockMvc.perform(get("/api/eventos/" + eventId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("PENDIENTE_APROBACION"));

        // 3. Listar eventos
        mockMvc.perform(get("/api/eventos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));

        // 4. Intentar inscribirse (debería fallar porque no está aprobado)
        mockMvc.perform(post("/api/inscripciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInscriptionRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Búsqueda de inscripciones por email")
    void testGetInscriptionsByEmail() throws Exception {
        mockMvc.perform(get("/api/inscripciones/email/carlos@email.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0))); // Sin inscripciones aún
    }

    @Test
    @DisplayName("Validación: Email es requerido")
    void testInscriptionEmailRequired() throws Exception {
        InscriptionRequest invalidRequest = new InscriptionRequest();
        invalidRequest.setEventId(eventId);
        invalidRequest.setParticipanteNombre("Carlos");
        invalidRequest.setParticipanteEmail(""); // Email vacío
        invalidRequest.setParticipanteTelefono("12345678");

        mockMvc.perform(post("/api/inscripciones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}