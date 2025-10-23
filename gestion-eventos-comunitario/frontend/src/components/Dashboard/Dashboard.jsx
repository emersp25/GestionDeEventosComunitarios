import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getEvents } from '../../api/events.js';
import { alertError } from '../../utils/alerts.js';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function formatMoneyGTQ(n) {
  if (typeof n !== 'number' || Number.isNaN(n)) return 'Q0.00';
  try {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ', maximumFractionDigits: 2 }).format(n);
  } catch {
    return `Q${n.toFixed(2)}`;
  }
}

function badgeByStatus(status, label) {
  let cls = 'badge badge-secondary';
  if (status === 'APROBADO') cls = 'badge badge-success';
  else if (status === 'PENDIENTE_APROBACION') cls = 'badge badge-warning';
  else if (status === 'RECHAZADO') cls = 'badge badge-danger';
  return <span className={cls}>{label || status || '—'}</span>;
}

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      
      console.error('Error al cargar eventos (Dashboard):', err);
      await alertError('Error al cargar dashboard', err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

 
  const {
    totalEventos,
    totalInscritos,
    aprobados,
    pendientes,
    rechazados,
    presupuestoPendiente
  } = useMemo(() => {
    const totalEventos = events.length;
    let totalInscritos = 0;
    let aprobados = 0;
    let pendientes = 0;
    let rechazados = 0;
    let presupuestoPendiente = 0;

    for (const ev of events) {
      totalInscritos += Number(ev.totalInscripciones || 0);
      if (ev.status === 'APROBADO') aprobados += 1;
      else if (ev.status === 'PENDIENTE_APROBACION') {
        pendientes += 1;
        
        const solicitado = Number(ev.presupuestoSolicitado || 0);
        const aprobado = Number(ev.presupuestoAprobado || 0);
        const restante = Math.max(0, solicitado - aprobado);
        presupuestoPendiente += restante;
      } else if (ev.status === 'RECHAZADO') rechazados += 1;
    }

    return { totalEventos, totalInscritos, aprobados, pendientes, rechazados, presupuestoPendiente };
  }, [events]);


  const recientes = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const da = new Date(a.fechaActualizacion || a.fechaCreacion || 0).getTime();
      const db = new Date(b.fechaActualizacion || b.fechaCreacion || 0).getTime();
      return db - da;
    });
    return sorted.slice(0, 5);
  }, [events]);

  return (
    <div className="dashboard">
      {/* Título y acciones */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Dashboard - Eventos Comunitarios</h2>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary mr-2"
            onClick={fetchData}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`} />
            {loading ? 'Actualizando...' : 'Refrescar'}
          </button>
          <NavLink to="/events/create" className="btn btn-primary">
            <i className="fas fa-plus mr-2" />
            Nuevo Evento
          </NavLink>
        </div>
      </div>

      {/* Métricas principales (dinámicas) */}
      <div className="row">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Eventos Totales</div>
              <div className="display-4 text-dark font-weight-bold">{totalEventos}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Aprobados</div>
              <div className="display-4 text-success font-weight-bold">{aprobados}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Pendientes</div>
              <div className="display-4 text-warning font-weight-bold">{pendientes}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Rechazados</div>
              <div className="display-4 text-danger font-weight-bold">{rechazados}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="row">
        <div className="col-lg-6 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Total Inscritos</div>
              <div className="display-4 text-primary font-weight-bold">{totalInscritos}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 mb-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-muted mb-1">Presupuesto Pendiente</div>
              <div className="display-4 text-info font-weight-bold">{formatMoneyGTQ(presupuestoPendiente)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title mb-0">Acciones Rápidas</h3>
        </div>
        <div className="card-body d-flex flex-wrap align-items-center">
          <NavLink to="/events/create" className="btn btn-primary mr-2 mb-2">
            <i className="fas fa-plus mr-2"></i>Nuevo Evento
          </NavLink>
          <NavLink to="/events" className="btn btn-outline-secondary mr-2 mb-2">
            <i className="fas fa-list mr-2"></i>Ver Eventos
          </NavLink>
          <button type="button" className="btn btn-success mr-2 mb-2" disabled>
            <i className="fas fa-chart-bar mr-2"></i>Ver Reportes
          </button>
          <NavLink to="/calendar" className="btn btn-secondary mb-2">
            <i className="far fa-calendar-alt mr-2"></i>Calendario
          </NavLink>
        </div>
      </div>

      {/* Eventos recientes desde API */}
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h3 className="card-title mb-0">Eventos Recientes</h3>
          <NavLink to="/events" className="btn btn-sm btn-outline-primary">
            Ver todos
          </NavLink>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Creación/Actualización</th>
                  <th>Inscritos</th>
                  <th>Estado</th>
                  <th>Presupuesto</th>
                </tr>
              </thead>
              <tbody>
                {!loading && recientes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No hay eventos registrados.
                    </td>
                  </tr>
                )}
                {recientes.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.nombre}</td>
                    <td>
                      <div className="small text-muted">Creado: {formatDate(ev.fechaCreacion)}</div>
                      <div className="small">Actualizado: {formatDate(ev.fechaActualizacion)}</div>
                    </td>
                    <td>
                      {Number(ev.totalInscripciones || 0)}
                      {typeof ev.capacidadMaxima === 'number' ? ` / ${ev.capacidadMaxima}` : ''}
                    </td>
                    <td>{badgeByStatus(ev.status, ev.statusDescripcion)}</td>
                    <td>{formatMoneyGTQ(Number(ev.presupuestoSolicitado || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
