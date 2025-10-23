import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { getBudgetRequests } from '../../api/budgets.js';
import { alertError } from '../../utils/alerts.js';
import Pagination from '../UI/Pagination.jsx';



function statusBadge(id) {
  switch (id) {
    case 2: // Aprobado
      return { className: 'badge badge-success', label: 'Aprobado' };
    case 3: // Rechazado
      return { className: 'badge badge-danger', label: 'Rechazado' };
    case 1: // Pendiente
    default:
      return { className: 'badge badge-warning', label: 'Pendiente' };
  }
}

function priorityLabel(id) {
  switch (Number(id)) {
    case 1:
      return '1 - Alta';
    case 2:
      return '2 - Media';
    case 3:
      return '3 - Baja';
    default:
      return id ?? '—';
  }
}

function formatAmount(q) {
  const n = Number(q);
  if (Number.isFinite(n)) {
    try {
      return n.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' });
    } catch {
      return `Q ${n.toLocaleString('es-GT')}`;
    }
  }
  return q ?? '—';
}

export default function BudgetsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBudgetRequests();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar presupuestos:', err);
      await alertError('Error al cargar presupuestos', err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <h3 className="card-title mb-0">Presupuestos</h3>
          <span className="badge badge-light text-dark ml-2">{rows.length}</span>
        </div>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-primary mr-2"
            onClick={fetchData}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`} />
            {loading ? 'Cargando...' : 'Refrescar'}
          </button>
          <NavLink to="/budgets/create" className="btn btn-primary">
            <i className="fas fa-plus mr-2" />
            Nuevo Presupuesto
          </NavLink>
        </div>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Monto Solicitado</th>
                <th>Prioridad</th>
                <th>Fecha de Solicitud</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted text-center">
                    No hay presupuestos registrados aún.
                  </td>
                </tr>
              )}
              {pagedRows.map((r, idx) => {
                const st = statusBadge(r.requestStatusId);
                return (
                  <tr key={idx}>
                    <td>{r.name ?? '—'}</td>
                    <td>{r.email ?? '—'}</td>
                    <td>{formatAmount(r.requestAmount)}</td>
                    <td>{priorityLabel(r.priorityId)}</td>
                    <td>{r.requestDate ?? '—'}</td>
                    <td>
                      <span className={st.className}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3">
            <Pagination
              total={rows.length}
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
