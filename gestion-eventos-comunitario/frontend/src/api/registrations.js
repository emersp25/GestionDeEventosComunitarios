import { httpPost, httpGet } from './http.js';

/**
 * Registrations (Inscripciones) API
 * POST /inscripciones
 */
export async function createRegistration(payload) {

  return httpPost('inscripciones', payload);
}

export async function getRegistrations() {
  // GET /inscripciones -> { success, message, data: [] }
  const res = await httpGet('inscripciones');
  return (res && Array.isArray(res.data)) ? res.data : [];
}
