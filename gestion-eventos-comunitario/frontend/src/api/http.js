import { joinUrl } from './config.js';
import { getToken, clearAuth } from '../utils/authStorage.js';
const BASE_PATH = (import.meta && import.meta.env && typeof import.meta.env.BASE_URL === 'string')
  ? import.meta.env.BASE_URL
  : '/';
const LOGIN_URL = (BASE_PATH.endsWith('/') ? BASE_PATH : BASE_PATH + '/') + 'login';



async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

function buildHeaders(extra) {
  const token = getToken();
  const base = {
    'Content-Type': 'application/json'
  };
  if (token) {
    base.Authorization = `Bearer ${token}`;
  }
  return {
    ...base,
    ...(extra || {})
  };
}

export async function httpPost(path, body, headers) {
  const url = joinUrl(path);
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(headers),
    body: JSON.stringify(body)
  });

  const data = await parseJsonSafe(res);
  if (res.status === 401) {
    try { clearAuth(); } catch {}
    try {
      if (typeof window !== 'undefined' && window.location && window.location.pathname !== LOGIN_URL) {
        window.location.assign(LOGIN_URL);
      }
    } catch {}
    const err = new Error('No autorizado');
    err.status = 401;
    err.data = data;
    throw err;
  }
  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.errors)) || res.statusText;
    const err = new Error(typeof msg === 'string' ? msg : 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function httpGet(path, headers) {
  const url = joinUrl(path);
  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(headers)
  });

  const data = await parseJsonSafe(res);
  if (res.status === 401) {
    try { clearAuth(); } catch {}
    try {
      if (typeof window !== 'undefined' && window.location && window.location.pathname !== LOGIN_URL) {
        window.location.assign(LOGIN_URL);
      }
    } catch {}
    const err = new Error('No autorizado');
    err.status = 401;
    err.data = data;
    throw err;
  }
  if (!res.ok) {
    const msg = (data && (data.message || data.error || data.errors)) || res.statusText;
    const err = new Error(typeof msg === 'string' ? msg : 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
