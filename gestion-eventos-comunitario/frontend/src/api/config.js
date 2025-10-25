
export const API_BASE_URL = 'http://93.127.139.74:8080/EVENTOS/api/v1';
//export const API_BASE_URL = 'http://localhost:8080/api/v1';

export function joinUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}
