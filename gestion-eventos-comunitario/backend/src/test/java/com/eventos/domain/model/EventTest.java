package com.eventos.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/*Pruebas unitarias para la entidad Event*/

public class EventTest {
    private Event event;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    @BeforeEach
    void setUp() {
        fechaInicio = LocalDateTime.now().plusDays(1);
        fechaFin = LocalDateTime.now().plusDays(2);

        event = new Event(
                "Taller de Spring Boot",
                "Aprende Spring Boot desde cero",
                fechaInicio,
                fechaFin,
                "Auditorio Central",
                50,
                "Juan Pérez",
                new BigDecimal("1000.00")
        );
    }

    @Test
    @DisplayName("Debe crear un evento con estado PENDIENTE_APROBACION")
    void debeCrearEventoConEstadoPendiente() {
        assertNotNull(event.getId());
        assertEquals("Taller de Spring Boot", event.getNombre());
        assertEquals(EventStatus.PENDIENTE_APROBACION, event.getStatus());
        assertNull(event.getPresupuestoAprobado());
    }

    @Test
    @DisplayName("Debe aprobar presupuesto correctamente")
    void debeAprobarPresupuestoCorrectamente() {
        BigDecimal montoAprobado = new BigDecimal("800.00");

        event.aprobarPresupuesto(montoAprobado);

        assertEquals(EventStatus.APROBADO, event.getStatus());
        assertEquals(montoAprobado, event.getPresupuestoAprobado());
    }

    @Test
    @DisplayName("No debe aprobar presupuesto si no está pendiente")
    void noDebeAprobarSiNoEstaPendiente() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));

        assertThrows(IllegalStateException.class, () -> {
            event.aprobarPresupuesto(new BigDecimal("900.00"));
        });
    }

    @Test
    @DisplayName("No debe aprobar presupuesto con monto cero o negativo")
    void noDebeAprobarConMontoCeroONegativo() {
        assertThrows(IllegalArgumentException.class, () -> {
            event.aprobarPresupuesto(BigDecimal.ZERO);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            event.aprobarPresupuesto(new BigDecimal("-100.00"));
        });
    }

    @Test
    @DisplayName("Debe rechazar presupuesto correctamente")
    void debeRechazarPresupuestoCorrectamente() {
        event.rechazarPresupuesto();

        assertEquals(EventStatus.RECHAZADO, event.getStatus());
        assertNull(event.getPresupuestoAprobado());
    }

    @Test
    @DisplayName("Debe agregar inscripción si el evento está aprobado")
    void debeAgregarInscripcionSiEstaAprobado() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));

        event.agregarInscripcion("inscripcion-1");
        event.agregarInscripcion("inscripcion-2");

        assertEquals(2, event.getInscripcionesIds().size());
        assertTrue(event.getInscripcionesIds().contains("inscripcion-1"));
    }

    @Test
    @DisplayName("No debe agregar inscripción si no está aprobado")
    void noDebeAgregarInscripcionSiNoEstaAprobado() {
        assertThrows(IllegalStateException.class, () -> {
            event.agregarInscripcion("inscripcion-1");
        });
    }

    @Test
    @DisplayName("No debe agregar inscripción si alcanzó capacidad máxima")
    void noDebeAgregarInscripcionSiAlcanzoCapacidad() {
        Event eventoChico = new Event(
                "Evento pequeño",
                "Descripción",
                fechaInicio,
                fechaFin,
                "Lugar",
                2,
                "Organizador",
                new BigDecimal("500.00")
        );

        eventoChico.aprobarPresupuesto(new BigDecimal("500.00"));
        eventoChico.agregarInscripcion("inscripcion-1");
        eventoChico.agregarInscripcion("inscripcion-2");

        assertThrows(IllegalStateException.class, () -> {
            eventoChico.agregarInscripcion("inscripcion-3");
        });
    }

    @Test
    @DisplayName("Debe cancelar inscripción correctamente")
    void debeCancelarInscripcionCorrectamente() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));
        event.agregarInscripcion("inscripcion-1");

        event.cancelarInscripcion("inscripcion-1");

        assertEquals(0, event.getInscripcionesIds().size());
    }

    @Test
    @DisplayName("Debe lanzar excepción al cancelar inscripción inexistente")
    void debeLanzarExcepcionAlCancelarInscripcionInexistente() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));

        assertThrows(IllegalArgumentException.class, () -> {
            event.cancelarInscripcion("inscripcion-inexistente");
        });
    }

    @Test
    @DisplayName("Debe cancelar evento correctamente")
    void debeCancelarEventoCorrectamente() {
        event.cancelarEvento();

        assertEquals(EventStatus.CANCELADO, event.getStatus());
    }

    @Test
    @DisplayName("Debe actualizar información del evento")
    void debeActualizarInformacionDelEvento() {
        LocalDateTime nuevaFechaInicio = LocalDateTime.now().plusDays(5);
        LocalDateTime nuevaFechaFin = LocalDateTime.now().plusDays(6);

        event.actualizarInformacion(
                "Nuevo nombre",
                "Nueva descripción",
                nuevaFechaInicio,
                nuevaFechaFin,
                "Nueva ubicación",
                "APROBADO"
        );

        assertEquals("Nuevo nombre", event.getNombre());
        assertEquals("Nueva descripción", event.getDescripcion());
        assertEquals(nuevaFechaInicio, event.getFechaInicio());
        assertEquals(nuevaFechaFin, event.getFechaFin());
        assertEquals("Nueva ubicación", event.getUbicacion());
    }

    @Test
    @DisplayName("Debe verificar cupos disponibles correctamente")
    void debeVerificarCuposDisponibles() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));

        assertTrue(event.tieneCuposDisponibles());
        assertEquals(50, event.getCuposDisponibles());

        event.agregarInscripcion("inscripcion-1");
        assertEquals(49, event.getCuposDisponibles());
    }

    @Test
    @DisplayName("Debe retornar copia inmutable de inscripciones")
    void debeRetornarCopiaInmutableDeInscripciones() {
        event.aprobarPresupuesto(new BigDecimal("800.00"));
        event.agregarInscripcion("inscripcion-1");

        var inscripciones = event.getInscripcionesIds();
        inscripciones.add("inscripcion-falsa");

        assertEquals(1, event.getInscripcionesIds().size());
    }
}
