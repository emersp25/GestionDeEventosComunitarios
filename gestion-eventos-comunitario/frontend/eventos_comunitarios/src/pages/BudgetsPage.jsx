// src/pages/BudgetsPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/Budgets.css';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterAmount, setFilterAmount] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState(null);


  // Filtrar presupuestos
  const filteredBudgets = budgets.filter(budget => {
    const matchesStatus = filterStatus === 'all' || budget.status === filterStatus;
    const matchesDate = filterDate === 'all' || budget.requestDate.includes(filterDate);
    const matchesAmount = filterAmount === 'all' || 
                          (filterAmount === 'low' && budget.amount <= 1000) ||
                          (filterAmount === 'medium' && budget.amount > 1000 && budget.amount <= 2000) ||
                          (filterAmount === 'high' && budget.amount > 2000);

    return matchesStatus && matchesDate && matchesAmount;
  });

  // Calcular estadísticas
  const pending = filteredBudgets.filter(b => b.status === 'pending').length;
  const approved = filteredBudgets.filter(b => b.status === 'approved').length;
  const rejected = filteredBudgets.filter(b => b.status === 'rejected').length;
  const totalPendingAmount = filteredBudgets.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const totalApprovedAmount = filteredBudgets.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.amount, 0);
  const totalBudget = 25000; //presupuesto total disponible
  const usedBudget = totalApprovedAmount;
  const availableBudget = totalBudget - usedBudget;
  const utilizationRate = totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0;

  // Funciones para cambiar estado
  const approveBudget = (id) => {
    setBudgets(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'approved', response: 'Aprobado' } : b
    ));
  };

  const rejectBudget = (id) => {
    setBudgets(prev => prev.map(b => 
      b.id === id ? { ...b, status: 'rejected', response: 'Rechazado' } : b
    ));
  };

  const viewDetails = (budget) => {
    setSelectedBudget(budget);
  };

  const closeDetails = () => {
    setSelectedBudget(null);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="section-title">Gestión de Presupuestos</h1>
        <p className="section-subtitle">Solicitudes y autorizaciones del Departamento de Finanzas</p>

        <div className="card">
          {/* Estadísticas rápidas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{pending}</div>
              <div className="stat-label">Solicitudes Pendientes</div>
              <div className="stat-change">Q{totalPendingAmount} total</div>
              <div className="stat-change">⏱️ Tiempo prom: 2.3 días</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{approved}</div>
              <div className="stat-label">Aprobadas Este Mes</div>
              <div className="stat-change">Q{totalApprovedAmount} total</div>
              <div className="stat-change">✅ Tasa aprob: 85%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Q{availableBudget.toLocaleString()}</div>
              <div className="stat-label">Presupuesto Disponible</div>
              <div className="stat-change">de Q{totalBudget.toLocaleString()}</div>
              <div className="stat-change">📊 {utilizationRate}% utilizado</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{rejected}</div>
              <div className="stat-label">Rechazadas</div>
              <div className="stat-change">Q{filteredBudgets.filter(b => b.status === 'rejected').reduce((sum, b) => sum + b.amount, 0)} total</div>
              <div className="stat-change">❌ Requieren revisión</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-item">
              <label>Estado:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="in-process">En Proceso</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Fecha:</label>
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                <option value="all">Todas</option>
                <option value="Oct">Octubre</option>
                <option value="Nov">Noviembre</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Monto:</label>
              <select value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)}>
                <option value="all">Todos</option>
                <option value="low">Bajo (≤ Q1,000)</option>
                <option value="medium">Medio (Q1,001 - Q2,000)</option>
                <option value="high">Alto ( Q2,000)</option>
              </select>
            </div>
            <button className="btn btn-primary">+ Nueva Solicitud</button>
          </div>

          {/* Tabla de presupuestos */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Solicitante</th>
                  <th>Monto</th>
                  <th>Fecha Sol.</th>
                  <th>Estado</th>
                  <th>Respuesta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map(budget => (
                  <tr key={budget.id}>
                    <td>
                      <strong>{budget.event}</strong><br/>
                      <small>{budget.date}</small>
                    </td>
                    <td>
                      <strong>{budget.requester.name}</strong><br/>
                      <small>{budget.requester.role}</small>
                    </td>
                    <td>
                      Q{budget.amount.toLocaleString()}<br/>
                      <small>{budget.details.breakdown.length} ítems</small>
                    </td>
                    <td>{budget.requestDate}</td>
                    <td>
                      <span className={`status-badge ${budget.status}`}>
                        {budget.status === 'pending' && 'Pendiente'}
                        {budget.status === 'approved' && 'Aprobada'}
                        {budget.status === 'rejected' && 'Rechazada'}
                        {budget.status === 'in-process' && 'En Proceso'}
                      </span>
                    </td>
                    <td>
                      <span className={`response-status ${budget.response.toLowerCase().replace(/\s+/g, '-')}`}>
                        {budget.response}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => viewDetails(budget)}
                          title="Ver detalle"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => approveBudget(budget.id)}
                          disabled={budget.status !== 'pending'}
                          title="Aprobar"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => rejectBudget(budget.id)}
                          disabled={budget.status !== 'pending'}
                          title="Rechazar"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detalle de solicitud (modal o sección expandida) */}
          {selectedBudget && (
            <div className="budget-detail-panel">
              <div className="detail-header">
                <h4><i className="icon-folder"></i> Detalle de Solicitud - {selectedBudget.event}</h4>
                <button className="btn btn-sm btn-outline" onClick={closeDetails}>✖</button>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h5>INFORMACIÓN GENERAL</h5>
                  <div className="detail-row">
                    <strong>Evento:</strong> {selectedBudget.details.general.event}
                  </div>
                  <div className="detail-row">
                    <strong>Fecha:</strong> {selectedBudget.details.general.date}
                  </div>
                  <div className="detail-row">
                    <strong>Solicitante:</strong> {selectedBudget.details.general.requester}
                  </div>
                  <div className="detail-row">
                    <strong>Fecha Solicitud:</strong> {selectedBudget.details.general.requestDate}
                  </div>
                </div>

                <div className="detail-section">
                  <h5>DESGLOSE PRESUPUESTO</h5>
                  <ul className="breakdown-list">
                    {selectedBudget.details.breakdown.map((item, index) => (
                      <li key={index}>
                        • {item.item}: Q{item.cost}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h5>JUSTIFICACIÓN</h5>
                  <p>{selectedBudget.details.justification}</p>
                </div>

                <div className="detail-actions">
                  <button className="btn btn-success">✓ Aprobar</button>
                  <button className="btn btn-warning">👁️ Observar</button>
                  <button className="btn btn-danger">✗ Rechazar</button>
                  <button className="btn btn-outline">🖨️ Imprimir</button>
                </div>
              </div>
            </div>
          )}

          {/* Acciones Masivas */}
          <div className="quick-actions-bar">
            <div className="quick-actions-label">Acciones Masivas:</div>
            <div className="quick-actions-buttons">
              <button className="btn btn-success">✓ Aprobar Sel.</button>
              <button className="btn btn-danger">✗ Rechazar Sel.</button>
              <button className="btn btn-primary">📢 Notificar Estado</button>
              <button className="btn btn-warning">📈 Exportar Excel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;