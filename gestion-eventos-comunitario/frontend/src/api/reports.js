import { httpGet } from './http.js';


export async function getInscritosPorEvento(eventoID) {
  if (!eventoID) throw new Error('EventoID requerido');
  const res = await httpGet(`reportes/inscritos-por-evento/${eventoID}`);
  return res?.data ?? res;
}


function buildQuery(params = {}) {
  const q = new URLSearchParams();
  if (params.year != null && params.year !== '') q.append('year', String(params.year));
  if (params.startDate) q.append('startDate', String(params.startDate));
  if (params.endDate) q.append('endDate', String(params.endDate));
  if (params.limit != null && params.limit !== '') q.append('limit', String(params.limit));
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function getEventosPorMes(params = {}) {
  const qs = buildQuery(params);
  const res = await httpGet(`reportes/eventos-por-mes${qs}`);
  return res?.data ?? res;
}


export async function getTopEventos(limit = 5) {
  const qs = buildQuery({ limit });
  const res = await httpGet(`reportes/top-eventos${qs}`);
  return res?.data ?? res;
}


export async function getTotales(params = {}) {
  const qs = buildQuery(params);
  const res = await httpGet(`reportes/totales${qs}`);
  return res?.data ?? res;
}
