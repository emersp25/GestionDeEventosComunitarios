# REPORTE DE INTEGRACIÓN: Escenarios Cruzados con Otros Sistemas

**Sistema:** Gestión de Eventos Comunitarios  
**Versión:** 1.1.0  
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

- **Interfaz de Integración (actualizada):**
  - **Base URL (ejemplo):** `http://<host-finanzas>/api/v1`
  - **Autenticación:** `POST /api/v1/Auth`
    - **Request**
      ```json
      { "userName": "string", "password": "string" }
      ```
    - **Response (ejemplo)**
      ```json
      { "success": true, "message": "ok", "token": "eyJhbGciOi...", "expiresAt": "2025-10-31T23:59:59Z" }
      ```
    - **Uso:** Enviar `Authorization: Bearer <token>` en las llamadas a Budget.
  - **Presupuestos**
    - **POST** `/api/v1/Budget`
      ```json
      {
        "id": 0,
        "authorizedAmount": 0,
        "availableAmount": 0,
        "period": 0,
        "createdBy": 0,
        "updatedBy": 0
      }
      ```
    - **GET** `/api/v1/Budget`
      ```json
      {
        "success": true,
        "message": "string",
        "data": [
          {
            "id": 0,
            "authorizedAmount": 0,
            "availableAmount": 0,
            "committedAmount": 0,
            "period": 0,
            "state": 0,
            "createdBy": 0,
            "updatedBy": 0,
            "createdAt": "string",
            "updatedAt": "string"
          }
        ],
        "totalResults": 0
      }
      ```
    - **GET** `/api/v1/Budget/{id}`
      ```json
      {
        "success": true,
        "message": "string",
        "data": {
          "id": 0,
          "authorizedAmount": 0,
          "availableAmount": 0,
          "committedAmount": 0,
          "period": 0,
          "state": 0,
          "createdBy": 0,
          "updatedBy": 0,
          "createdAt": "string",
          "updatedAt": "string"
        },
        "totalResults": 0
      }
      ```

#### 2.2.1 Autenticación y Tokens (JWT)
- **Flujo:**  
  1) `POST /api/v1/Auth` → 2) guardar `token` y `expiresAt` → 3) consumir `/api/v1/Budget*` con `Authorization: Bearer <token>`  
- **Renovación:** si Finanzas responde **401**, reintentar **una vez** renovando el token y repetir la llamada.  
- **Buenas prácticas:** refrescar el token 2–5 min antes de su expiración.

### 2.3 Sistema de Notificaciones (Futuro)
- **Responsabilidades:**
  - Enviar emails de confirmación
  - Notificar cambios en eventos
  - Recordatorios de eventos


---

## 3. Escenario 1: Solicitud de Presupuesto a Finanzas

### 3.1 Descripción
Cuando un usuario crea un nuevo evento, el sistema debe solicitar la aprobación del presupuesto al Sistema de Finanzas.

### 3.2 Flujo de Integración (actualizado)

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
             │ 2) POST /api/v1/Auth
             │    { userName, password } → { token, expiresAt }
             │
             │ 3) POST /api/v1/Budget
             │    Authorization: Bearer <token>
             │    (JSON con datos del presupuesto)
             │
             ▼
┌─────────────────────────────────────┐
│ Sistema de Finanzas                 │
│ - Recibe solicitud                  │
│ - Valida presupuesto                │
│ - Aprueba o rechaza                 │
└────────────┬────────────────────────┘
             │
             │ 4) Respuesta: Aprobado/Rechazado/…
             │
             ▼
┌─────────────────────────────────────┐
│ Sistema de Eventos Comunitarios     │
│ - Actualiza estado del evento       │
│ - Guarda referencia de Finanzas     │
└─────────────────────────────────────┘
```

### 3.3 Estructura de Solicitud (DTO interno de Eventos)

> Este DTO es propio del **Sistema de Eventos** y se mapea al esquema esperado por Finanzas.

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

**Mapeo de campos (interno → Finanzas /api/v1/Budget):**
- `requestAmount` → `authorizedAmount` y/o `availableAmount` (según regla de negocio inicial)
- `name` / `reason` → metadatos locales (no enviados si Finanzas no los requiere)
- `requestDate` → usado para `period` (p.ej., año)
- `originId`, `priorityId`, `email` → permanecen en la base de Eventos

### 3.3.1 Estructura de Solicitud **a Finanzas** (POST `/api/v1/Budget`)

```json
{
  "id": 0,
  "authorizedAmount": 0,
  "availableAmount": 0,
  "period": 0,
  "createdBy": 0,
  "updatedBy": 0
}
```

### 3.4 Respuestas de Finanzas (envoltorio estándar)

**GET** `/api/v1/Budget` (listar):
```json
{
  "success": true,
  "message": "string",
  "data": [
    {
      "id": 0,
      "authorizedAmount": 0,
      "availableAmount": 0,
      "committedAmount": 0,
      "period": 0,
      "state": 0,
      "createdBy": 0,
      "updatedBy": 0,
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "totalResults": 0
}
```

**GET** `/api/v1/Budget/{id}` (detalle):
```json
{
  "success": true,
  "message": "string",
  "data": {
    "id": 0,
    "authorizedAmount": 0,
    "availableAmount": 0,
    "committedAmount": 0,
    "period": 0,
    "state": 0,
    "createdBy": 0,
    "updatedBy": 0,
    "createdAt": "string",
    "updatedAt": "string"
  },
  "totalResults": 0
}
```

### 3.5 Caso de Uso Implementado

```
UseCase: ConsultBudgetStatusUseCase

Entrada:
  - eventId: String

Proceso:
  1. Buscar evento por ID
  2. Autenticarse en Finanzas → token
  3. Enviar solicitud a /api/v1/Budget
  4. Consultar estado (GET /api/v1/Budget o /api/v1/Budget/{id})
  5. Actualizar estado del evento

Salida:
  - Event actualizado con estado (APROBADO/RECHAZADO/PENDIENTE)
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
| `/api/v1/Auth` | Finanzas | POST | Autenticarse y obtener token JWT |
| `/api/v1/Budget` | Finanzas | POST | Crear/registrar presupuesto |
| `/api/v1/Budget` | Finanzas | GET | Listar presupuestos |
| `/api/v1/Budget/{id}` | Finanzas | GET | Obtener presupuesto por id |


---

## 7. Manejo de Errores y Reintentos

### 7.1 Casos de Error

**Si Finanzas no responde:**
- Implementar reintentos exponenciales (3 intentos)
- Timeout después de 30 segundos
- Mantener evento en estado `PENDING_FINANZAS_RESPONSE`
- Notificar al organizador después de 24 horas

**Errores de Autenticación/Autorización (401/403):**
- Invalidar token local
- Renovar token (una vez) y **reintentar** la llamada original
- Si persiste, registrar incidente y dejar en estado pendiente

**Rate limit (429):**
- Backoff exponencial iniciando en 2s (máximo 5 intentos)

**Errores de validación (400/422):**
- Registrar detalles de validación
- No reintentar automáticamente (corregir datos primero)

### 7.2 Implementación Posible

```java
// Pseudo-código
@Retryable(maxAttempts = 3, backoff = @Backoff(delay = 1000))
public BudgetResponse callFinanzasWithAuth(BudgetRequest req) {
  try {
    var token = tokenProvider.ensure();
    return finanzasApi.postBudget(req, token);
  } catch (Unauthorized e) {
    tokenProvider.refresh(); // re-autenticación
    return finanzasApi.postBudget(req, tokenProvider.ensure());
  }
}
```

---

## 8. Seguridad en Integraciones

### 8.1 Autenticación (actualizado)
- Autenticación **JWT** mediante `POST /api/v1/Auth`
- Incluir `Authorization: Bearer <token>` en llamadas a `/api/v1/Budget*`
- Refrescar 2–5 minutos antes de la expiración

### 8.2 Validación de Datos
- Validar estructura JSON antes de enviar
- Usar HTTPS en todas las integraciones
- Firmar payloads sensibles con HMAC (si aplica)

### 8.3 Logging y Auditoría
- Registrar todas las integraciones (request/response sin datos sensibles)
- No guardar datos sensibles en logs
- Mantener trazabilidad de transacciones

---

## 9. Conclusiones

El Sistema de Gestión de Eventos Comunitarios está diseñado con arquitectura extensible que permite:

1. **Integración clara con Finanzas** mediante REST API y JWT
2. **Separación de responsabilidades** entre sistemas
3. **Manejo robusto de errores** y reintentos
4. **Facilidad de mantenimiento** gracias a la arquitectura hexagonal
5. **Escalabilidad futura** para agregar más integraciones

---

## 10. Contacto y Soporte

- **Equipo de Desarrollo:** eventos-dev@umg.edu.gt
- **API Documentation (Eventos):** http://localhost:8080/swagger-ui/index.html
- **Ambiente de Desarrollo:** PostgreSQL en localhost:5432
