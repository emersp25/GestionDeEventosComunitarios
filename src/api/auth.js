import { httpPost } from './http.js';

/**
 * Autenticación
 * Endpoint: POST /auth/login
 * Body: { email, password }
 * Respuesta esperada:
 * {
 *   "success": true,
 *   "message": "Login exitoso",
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiJ9...",
 *     "nombre": "Administrador",
 *     "email": "admin@local",
 *     "role": "ADMIN"
 *   },
 *   "timestamp": "2025-10-22T09:36:54.2426019"
 * }
 */
export async function login(email, password) {
  const payload = { email, password };
  const resp = await httpPost('/auth/login', payload);
  // El backend devuelve { success, message, data, timestamp }
  const data = resp?.data || resp;
  if (!data?.token) {
    const err = new Error('Respuesta de autenticación inválida');
    err.data = resp;
    throw err;
  }
  return {
    token: data.token,
    user: {
      name: data.nombre || data.name || '',
      email: data.email || email,
      role: data.role || 'USER'
    }
  };
}

/**
 * Registro de usuario
 * Endpoint: POST /auth/register
 * Body:
 * {
 *   "nombre": "string",
 *   "email": "user@example.com",
 *   "password": "string",
 *   "telefono": "string"
 * }
 * Respuesta: se retorna la respuesta sin asumir estructura (puede ser {success, message, data})
 */
export async function register({ nombre, email, password, telefono }) {
  const payload = { nombre, email, password, telefono };
  const resp = await httpPost('/auth/register', payload);
  return resp;
}
