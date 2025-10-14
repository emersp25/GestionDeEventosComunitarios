// src/pages/InscriptionsPage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/Inscriptions.css';

const InscriptionsPage = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  // Filtrar inscripciones
  const filteredInscriptions = inscriptions.filter(insc => {
    const matchesEvent = filterEvent === 'all' || insc.event.includes(filterEvent);
    const matchesStatus = filterStatus === 'all' || insc.status === filterStatus;
    const matchesSearch = insc.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insc.participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          insc.event.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesStatus && matchesSearch;
  });

  // Calcular estadísticas
  const total = filteredInscriptions.length;
  const today = filteredInscriptions.filter(i => i.inscriptionDate === '23 Oct 2025').length; // Ejemplo
  const waiting = filteredInscriptions.filter(i => i.status === 'waiting').length;
  const confirmed = filteredInscriptions.filter(i => i.status === 'confirmed').length;
  const confirmedPercentage = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  // Funciones para cambiar estado
  const changeStatus = (id, newStatus) => {
    setInscriptions(prev => prev.map(insc => 
      insc.id === id ? { ...insc, status: newStatus } : insc
    ));
  };

  const confirmInscription = (id) => {
    setInscriptions(prev => prev.map(insc => 
      insc.id === id ? { ...insc, confirmation: 'confirmed' } : insc
    ));
  };

  const cancelInscription = (id) => {
    setInscriptions(prev => prev.map(insc => 
      insc.id === id ? { ...insc, status: 'cancelled', confirmation: 'cancelled' } : insc
    ));
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="section-title">Gestión de Inscripciones</h1>
        <p className="section-subtitle">Administra las inscripciones de todos los eventos comunitarios</p>

        <div className="card">
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-item">
              <label>Eventos:</label>
              <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
                <option value="all">Todos los eventos</option>
                <option value="Feria">Feria Gastronómica</option>
                <option value="Festival">Festival de Música</option>
                <option value="Taller">Taller Manualidades</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Estado:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Todos</option>
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
                <option value="waiting">En Espera</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Buscar persona...</label>
              <input
                type="text"
                placeholder="Nombre, email o evento"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary">+ Nueva</button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total Inscripciones</div>
              <div className="stat-change">+5.2% esta semana</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{today}</div>
              <div className="stat-label">Inscripciones Hoy</div>
              <div className="stat-change">Última: hace 15min</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{waiting}</div>
              <div className="stat-label">Lista de Espera</div>
              <div className="stat-change">3 eventos llenos</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{confirmedPercentage}%</div>
              <div className="stat-label">Confirmadas</div>
              <div className="stat-change">1,109 confirmadas</div>
            </div>
          </div>

          {/* Tabla de inscripciones */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Evento</th>
                  <th>Fecha Inscr.</th>
                  <th>Estado</th>
                  <th>Confirmación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.map(insc => (
                  <tr key={insc.id}>
                    <td>
                      <div className="participant-info">
                        <span className={`avatar ${insc.participant.initials.slice(0,1).toLowerCase()}`}>
                          {insc.participant.initials}
                        </span>
                        <div>
                          <strong>{insc.participant.name}</strong><br/>
                          <small>{insc.participant.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{insc.event}</strong><br/>
                      <small>{insc.date}</small>
                    </td>
                    <td>{insc.inscriptionDate}</td>
                    <td>
                      <span className={`status-badge ${insc.status}`}>
                        {insc.status === 'confirmed' && 'Confirmada'}
                        {insc.status === 'pending' && 'Pendiente'}
                        {insc.status === 'waiting' && 'En Espera'}
                        {insc.status === 'cancelled' && 'Cancelada'}
                        {insc.status === 'registered' && 'Registrada'}
                      </span>
                    </td>
                    <td>
                      <span className={`confirmation-status ${insc.confirmation}`}>
                        {insc.confirmation === 'confirmed' && '✓ Confirmado'}
                        {insc.confirmation === 'unconfirmed' && '⚠ Sin confirmar'}
                        {insc.confirmation === 'waiting' && '⏳ Lista espera'}
                        {insc.confirmation === 'cancelled' && '❌ Cancelado'}
                        {insc.confirmation === 'pending' && '○ Por confirmar'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => changeStatus(insc.id, 'confirmed')}
                          title="Confirmar"
                        >
                          ✓
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => changeStatus(insc.id, 'pending')}
                          title="Pendiente"
                        >
                          ⚠
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => cancelInscription(insc.id)}
                          title="Cancelar"
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

          {/* Paginación */}
          <div className="pagination">
            <span>Mostrando 1-8 de {total} inscripciones</span>
            <div className="page-buttons">
              <button className="btn btn-outline">←</button>
              <button className="btn btn-primary">1</button>
              <button className="btn btn-outline">2</button>
              <button className="btn btn-outline">→</button>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="quick-actions-bar">
            <div className="quick-actions-label">Acciones Rápidas:</div>
            <div className="quick-actions-buttons">
              <button className="btn btn-success">Enviar Recordatorio</button>
              <button className="btn btn-warning">Exportar Lista</button>
              <button className="btn btn-primary">Generar Reporte</button>
              <button className="btn btn-info">Sincronizar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionsPage;