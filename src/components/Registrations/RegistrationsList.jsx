import { useCallback, useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getRegistrations } from '../../api/registrations.js';
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
    case 'CONFIRMADA':
      return 'badge badge-success';
    case 'ACTIVA':
      return 'badge badge-info';
    case 'CANCELADA':
      return 'badge badge-danger';
    default:
      return 'badge badge-secondary';
  }
}

export default function RegistrationsList() {
  const [regs, setRegs] = useState([]);
  const [eventNameById, setEventNameById] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rgs, evs] = await Promise.all([getRegistrations(), getEvents()]);
      setRegs(Array.isArray(rgs) ? rgs : []);
      const map = {};
      (Array.isArray(evs) ? evs : []).forEach((ev) => {
        if (ev && ev.id) map[ev.id] = ev.nombre || ev.id;
      });
      setEventNameById(map);
    } catch (err) {
      
      console.error('Error al cargar inscripciones:', err);
      await alertError('Error al cargar inscripciones', err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pagedRegs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return regs.slice(start, start + pageSize);
  }, [regs, page, pageSize]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h3 className="card-title mb-0 mr-2">Inscripciones</h3>
          <span className="badge badge-light text-dark">{regs.length}</span>
        </div>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary mr-2"
            onClick={fetchData}
            disabled={loading}
            type="button"
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`} />
            {loading ? 'Cargando...' : 'Refrescar'}
          </button>
          <NavLink to="/registrations/create" className="btn btn-primary">
            <i className="fas fa-plus mr-2" />
            Nueva inscripción
          </NavLink>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Participante</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {!loading && regs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No hay inscripciones registradas.
                  </td>
                </tr>
              )}
              {pagedRegs.map((r) => (
                <tr key={r.id}>
                  <td>{r.eventNombre || eventNameById[r.eventId] || r.eventId}</td>
                  <td>{r.participanteNombre}</td>
                  <td>{r.participanteEmail}</td>
                  <td>{r.participanteTelefono}</td>
                  <td>
                    <span className={statusBadgeClass(r.status)}>
                      {r.statusDescripcion || r.status || '—'}
                    </span>
                  </td>
                  <td>{formatDate(r.fechaInscripcion)}</td>
                  <td className="text-truncate" style={{ maxWidth: 280 }} title={r.notasAdicionales || ''}>
                    {r.notasAdicionales || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <Pagination
              total={regs.length}
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
