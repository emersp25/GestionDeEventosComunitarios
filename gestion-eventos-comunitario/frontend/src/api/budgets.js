import { httpPost, httpGet } from './http.js';

export async function createBudgetRequest(payload) {
  // Por defecto, no enviamos requestDate y dejamos que el backend lo genere
  return httpPost('external/requests', payload);
}

export async function getBudgetRequests() {
  // GET /event/requests -> { success, message, data: [] }
  const res = await httpGet('event/requests');
  return (res && Array.isArray(res.data)) ? res.data : [];
}
