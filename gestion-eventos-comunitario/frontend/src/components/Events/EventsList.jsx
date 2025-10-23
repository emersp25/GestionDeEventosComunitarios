import{ useEffect, useState, useCallback, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getEvents } from '../../api/events.js';
import { alertError } from '../../utils/alerts.js';
import Pagination from '../UI/Pagination.jsx';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function statusBadgeClass(status) {
  switch (status) {
    case 'APROBADO':
      return 'badge badge-success';
    case 'PENDIENTE_APROBACION':
      return 'badge badge-warning';
    case 'RECHAZADO':
      return 'badge badge-danger';
    default:
      return 'badge badge-secondary';
  }
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      
      console.error('Error al cargar eventos:', err);
      await alertError('Error al cargar eventos', err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const pagedEvents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return events.slice(start, start + pageSize);
  }, [events, page, pageSize]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h3 className="card-title mb-0 mr-2">Eventos</h3>
          <span className="badge badge-light text-dark">{events.length}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-primary mr-2"
            onClick={fetchEvents}
            disabled={loading}
            type="button"
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`}></i>
            {loading ? 'Cargando...' : 'Refrescar'}
          </button>
          <NavLink to="/events/create" className="btn btn-primary">
            <i className="fas fa-plus mr-2"></i>
            Nuevo Evento
          </NavLink>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Cupos</th>
                <th>Organizador</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && events.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    No hay eventos registrados.
                  </td>
                </tr>
              )}
              {pagedEvents.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.nombre}</td>
                  <td>
                    <span className={statusBadgeClass(ev.status)}>
                      {ev.statusDescripcion || ev.status || '—'}
                    </span>
                  </td>
                  <td>{formatDate(ev.fechaInicio)}</td>
                  <td>{formatDate(ev.fechaFin)}</td>
                  <td>{ev.ubicacion}</td>
                  <td>{ev.capacidadMaxima}</td>
                  <td>{ev.cuposDisponibles ?? '—'}</td>
                  <td>{ev.organizador}</td>
                  <td>
                    <NavLink
                      to="/budgets/create"
                      state={{ eventId: ev.id, eventNombre: ev.nombre }}
                      className="btn btn-sm btn-outline-primary"
                      title="Solicitar presupuesto"
                    >
                      <i className="fas fa-file-invoice-dollar mr-1"></i>
                      Solicitar presupuesto
                    </NavLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <Pagination
              total={events.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
