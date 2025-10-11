# REPORTE DE INTEGRACIÓN: Escenarios Cruzados con Otros Sistemas

**Sistema:** Gestión de Eventos Comunitarios  
**Versión:** 1.0.0  
**Fecha:** Octubre 2025  
**Arquitectura:** Hexagonal (Ports & Adapters)

---

## 1. Descripción General

El Sistema de Gestión de Eventos Comunitarios interactúa con sistemas externos para:
- Validar y gestionar presupuestos (Sistema de Finanzas)
- Enviar notificaciones (Sistema de Notificaciones - Futuro)
- Consultar información de usuarios (Sistema de Usuarios - Futuro)

Este reporte documenta los escenarios de integración actuales y planeados.

---

## 2. Sistemas Involucrados

### 2.1 Sistema de Gestión de Eventos Comunitarios (Este Sistema)
- **Responsabilidades:**
  - Crear y gestionar eventos
  - Registrar inscripciones de participantes
  - Mantener información de eventos
  - Consultar estados de presupuestos

- **Puerto de Salida para Integración:**
  - REST API en `http://localhost:8080/api`
  - Base de datos PostgreSQL

### 2.2 Sistema de Finanzas (Sistema Externo)
- **Responsabilidades:**
  - Validar solicitudes de presupuesto
  - Aprobar o rechazar presupuestos
  - Mantener historial de aprobaciones

- **Interfaz de Integración:**
  - REST API (a definir por equipo de Finanzas)
  - Endpoint POST: `/api/budget-requests`
  - Endpoint GET: `/api/budget-requests/{id}/status`

### FUTURAS ACTUALIZACIONES
### 2.3 Sistema de Notificaciones
- **Responsabilidades:**
  - Enviar emails de confirmación
  - Notificar cambios en eventos
  - Recordatorios de eventos

### 2.4 Sistema de Usuarios
- **Responsabilidades:**
  - Gestionar perfiles de usuarios
  - Validar autenticación
  - Controlar accesos

---

## 3. Escenario 1: Solicitud de Presupuesto a Finanzas

### 3.1 Descripción
Cuando un usuario crea un nuevo evento, el sistema debe solicitar la aprobación del presupuesto al Sistema de Finanzas.

### 3.2 Flujo de Integración

```
┌─────────────────────────┐
│ Usuario                 │
│ (Organizador de Evento) │
└────────────┬────────────┘
             │
             │ 1. Crea evento
             │
             ▼
┌─────────────────────────────────────┐
│ Sistema de Eventos Comunitarios     │
│ - Registra evento                   │
│ - Estado: PENDIENTE_APROBACION      │
│ - Prepara solicitud de presupuesto  │
└────────────┬────────────────────────┘
             │
             │ 2. POST /api/budget-requests
             │    (JSON con datos de evento)
             │
             ▼
┌─────────────────────────────────────┐
│ Sistema de Finanzas                 │
│ - Recibe solicitud                  │
│ - Valida presupuesto                │
│ - Aprueba o rechaza                 │
└────────────┬────────────────────────┘
             │
             │ 3. Respuesta: Aprobado/Rechazado
             │
             ▼
┌─────────────────────────────────────┐
│ Sistema de Eventos Comunitarios     │
│ - Actualiza estado del evento       │
│ - APROBADO o RECHAZADO              │
│ - Guarda referencia de Finanzas     │
└─────────────────────────────────────┘
```

### 3.3 Estructura de Solicitud (POST a Finanzas)

```json
{
  "originId": 1,
  "requestAmount": 1500.50,
  "name": "Taller de Spring Boot",
  "reason": "Evento comunitario educativo sobre desarrollo con Spring Boot",
  "requestDate": "2025-10-15",
  "email": "juan.perez@eventos.com",
  "priorityId": 2
}
```

**Mapeo de campos:**
- `originId`: 1 = Eventos (constante en nuestro sistema)
- `requestAmount`: `event.presupuestoSolicitado`
- `name`: `event.nombre`
- `reason`: `event.descripcion`
- `requestDate`: Fecha actual en formato YYYY-MM-DD
- `email`: `event.organizador` (email del organizador)
- `priorityId`: 1=Baja, 2=Media, 3=Alta (según análisis)

### 3.4 Estructura de Respuesta (desde Finanzas)

```json
{
  "requestId": "FIN-2025-001",
  "status": "APPROVED",
  "approvedAmount": 1500.50,
  "rejectionReason": null,
  "approvalDate": "2025-10-15T14:30:00",
  "expiresAt": "2025-12-15"
}
```

**Estados posibles:**
- `APPROVED`: Presupuesto aprobado
- `REJECTED`: Presupuesto rechazado
- `PENDING`: Pendiente de revisión
- `PARTIALLY_APPROVED`: Aprobado con monto reducido

### 3.5 Caso de Uso Implementado

```
UseCase: ConsultBudgetStatusUseCase (A IMPLEMENTAR EN PRÓXIMA ENTREGA)

Entrada:
  - eventId: String

Proceso:
  1. Buscar evento por ID
  2. Construir solicitud para Finanzas
  3. Llamar REST API de Finanzas
  4. Procesar respuesta
  5. Actualizar estado del evento

Salida:
  - Event actualizado con estado (APROBADO/RECHAZADO)
```

---
## INTEGRACIONES FUTURAS
## 4. Escenario 2: Notificación de Cambios en Evento 

### 4.1 Descripción
Cuando ocurren cambios en un evento, el sistema notifica al Sistema de Notificaciones.

### 4.2 Eventos que Generan Notificaciones

1. **Evento Creado**
   - A: Organizador
   - Contenido: Confirmación de creación y estado de presupuesto

2. **Evento Aprobado**
   - A: Organizador
   - Contenido: Notificación de aprobación del presupuesto

3. **Evento Rechazado**
   - A: Organizador
   - Contenido: Razón del rechazo

4. **Nueva Inscripción**
   - A: Organizador
   - Contenido: Información del nuevo participante

5. **Evento Próximo**
   - A: Todos los inscritos
   - Contenido: Recordatorio 24 horas antes

### 4.3 Estructura de Notificación

```json
{
  "type": "EVENT_APPROVED",
  "recipient": "juan.perez@eventos.com",
  "subject": "Tu evento ha sido aprobado",
  "body": "El evento 'Taller de Spring Boot' ha sido aprobado con presupuesto de Q1,500.50",
  "eventId": "event-uuid-123",
  "metadata": {
    "eventName": "Taller de Spring Boot",
    "eventDate": "2025-11-15",
    "approvedBudget": 1500.50
  }
}
```

---

## 5. Escenario 3: Consulta de Estado de Presupuesto

### 5.1 Descripción
El usuario puede consultar el estado actual del presupuesto de su evento directamente desde el Sistema de Eventos.

### 5.2 Flujo

```
GET /api/eventos/{eventId}/budget-status

Respuesta:
{
  "eventId": "event-123",
  "eventName": "Taller de Spring Boot",
  "budgetStatus": "APPROVED",
  "budgetRequested": 1500.50,
  "budgetApproved": 1500.50,
  "financeRequestId": "FIN-2025-001",
  "lastUpdated": "2025-10-15T14:30:00"
}
```

---

## 6. Tabla de Integración: Endpoints y Responsabilidades

| Endpoint | Sistema | Método | Responsabilidad |
|----------|---------|--------|-----------------|
| `/api/eventos` | Eventos | POST | Crear evento y solicitar presupuesto |
| `/api/eventos/{id}` | Eventos | GET | Obtener detalles del evento |
| `/api/inscripciones` | Eventos | POST | Registrar inscripción |
| `/api/budget-requests` | Finanzas | POST | Recibir solicitud de presupuesto |
| `/api/budget-requests/{id}/status` | Finanzas | GET | Consultar estado de presupuesto |
| `/api/notifications` | Notificaciones | POST | Enviar notificación |

---

## 7. Manejo de Errores y Reintentos

### 7.1 Casos de Error

**Si Finanzas no responde:**
- Implementar reintentos exponenciales (3 intentos)
- Timeout después de 30 segundos
- Mantener evento en estado `PENDING_FINANZAS_RESPONSE`
- Notificar al organizador después de 24 horas

**Si falla la notificación:**
- Encolar el mensaje
- Reintentar cada 5 minutos
- Máximo 5 reintentos
- Registrar en log

### 7.2 Implementación Recomendada

```java
// Pseudo-código
public class BudgetConsultationService {
    
    @Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public BudgetResponse consultFinanzas(Event event) {
        // Llamar API de Finanzas con timeout de 30s
    }
    
    @CircuitBreaker(fallback = "fallbackBudgetResponse")
    public BudgetResponse callFinanzasApi(Event event) {
        // Si falla 5 veces en 1 minuto, abrir circuito
    }
}
```

---

## 8. Seguridad en Integraciones

### 8.1 Autenticación
- Usar API Keys para comunicación entre sistemas
- Headers: `Authorization: Bearer {API_KEY}`
- Rotar keys cada 90 días

### 8.2 Validación de Datos
- Validar estructura JSON antes de enviar
- Usar HTTPS en todas las integraciones
- Firmar payloads sensibles con HMAC

### 8.3 Logging y Auditoría
- Registrar todas las integraciones
- No guardar datos sensibles en logs
- Mantener trazabilidad de transacciones

---

## 9. Conclusiones

El Sistema de Gestión de Eventos Comunitarios está diseñado con arquitectura extensible que permite:

1. **Integración clara con Finanzas** mediante REST API
2. **Separación de responsabilidades** entre sistemas
3. **Manejo robusto de errores** y reintentos
4. **Facilidad de mantenimiento** gracias a la arquitectura hexagonal
5. **Escalabilidad futura** para agregar más integraciones

---

## 10. Contacto y Soporte

- **Equipo de Desarrollo:** eventos-dev@umg.edu.gt
- **API Documentation:** http://localhost:8080/swagger-ui/index.html
- **Ambiente de Desarrollo:** PostgreSQL en localhost:5432