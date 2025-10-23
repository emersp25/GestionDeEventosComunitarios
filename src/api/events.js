import { httpPost, httpGet } from './http.js';


export async function createEvent(payload) {
  // Backend expects ISO-8601 strings for fechaInicio/fechaFin and proper fields
  return httpPost('eventos', payload);
}

export async function getEvents() {
  // GET /eventos -> { success, message, data: [] }
  const res = await httpGet('eventos');
  return (res && Array.isArray(res.data)) ? res.data : [];
}

export async function getCalendarEvents() {
  // GET /eventos/calendario -> { success, message, data: [] }
  const res = await httpGet('eventos/calendario');
  return (res && Array.isArray(res.data)) ? res.data : [];
}
