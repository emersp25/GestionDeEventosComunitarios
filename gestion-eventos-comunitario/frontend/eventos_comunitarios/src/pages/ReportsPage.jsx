// src/pages/ReportsPage.jsx
import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/Reports.css';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    startDate: '01/10/2025',
    endDate: '31/10/2025',
    category: 'all'
  });

  // Datos simulados
  const stats = {
    events: 24,
    participants: 1847,
    budgetSpent: 39200,
    satisfaction: 4.2,
    evaluations: 248,
    attendanceRate: 94,
    goal: 20,
    avgPerEvent: 77,
    savings: 6550,
    budgetUsed: 73
  };

  const participationData = [
    { event: 'Feria', value: 120 },
    { event: 'Music', value: 80 },
    { event: 'Arte', value: 40 },
    { event: 'Deporte', value: 160 },
    { event: 'Salud', value: 100 }
  ];

  const budgetDistribution = [
    { label: 'Equipos', percentage: 35, color: '#28a745' },
    { label: 'Personal', percentage: 25, color: '#007bff' },
    { label: 'Materiales', percentage: 20, color: '#ffc107' },
    { label: 'Otros', percentage: 20, color: '#6c757d' }
  ];

  const topEvents = [
    { name: 'Festival Deportivo', participants: '189/200', satisfaction: 4.8, cost: 'Q9,500' },
    { name: 'Feria Gastronómica', participants: '156/180', satisfaction: 4.6, cost: 'Q11,200' },
    { name: 'Concierto Local', participants: '134/150', satisfaction: 4.5, cost: 'Q8,000' },
    { name: 'Taller Ecología', participants: '98/120', satisfaction: 4.4, cost: 'Q4,500' },
    { name: 'Expo Artesanal', participants: '87/100', satisfaction: 4.3, cost: 'Q6,000' }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    alert(`Filtros aplicados:\nDesde: ${filters.startDate}\nHasta: ${filters.endDate}\nCategoría: ${filters.category}`);
  };

  const generateReport = (type) => {
    alert(`Generando reporte: ${type}`);
  };

  const downloadReport = (format) => {
    alert(`Descargando reporte en formato: ${format}`);
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="section-title">Reportes y Estadísticas</h1>
        <p className="section-subtitle">Análisis de participación, costos y desempeño de eventos</p>

        <div className="card">
          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Desde:</label>
              <input
                type="text"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="filter-group">
              <label>Hasta:</label>
              <input
                type="text"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div className="filter-group">
              <label>Categoría:</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="all">Todas</option>
                <option value="cultural">Cultural</option>
                <option value="sports">Deportivo</option>
                <option value="educational">Educativo</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={applyFilters}>Aplicar</button>
            <button className="btn btn-success" onClick={() => generateReport('general')}>
              <i className="icon-generate"></i> Generar
            </button>
          </div>

          {/* Estadísticas generales */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{stats.events}</div>
              <div className="stat-label">Eventos Realizados</div>
              <div className="stat-change">+15% vs mes ant.</div>
              <div className="stat-change">🎯 Meta: {stats.goal} (Superada)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.participants}</div>
              <div className="stat-label">Participantes Total</div>
              <div className="stat-change">📊 Promedio: {stats.avgPerEvent}/evento</div>
              <div className="stat-change">👥 Tasa asistencia: {stats.attendanceRate}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">Q{stats.budgetSpent.toLocaleString()}</div>
              <div className="stat-label">Presupuesto Ejecutado</div>
              <div className="stat-change">📈 {stats.budgetUsed}% del presupuesto</div>
              <div className="stat-change">💰 Ahorro: Q{stats.savings.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.satisfaction}/5</div>
              <div className="stat-label">Satisfacción Promedio</div>
              <div className="stat-change">⭐ Muy buena</div>
              <div className="stat-change">📝 {stats.evaluations} evaluaciones</div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="charts-row">
            <div className="chart-card">
              <h4><i className="icon-chart-bar"></i> Participación por Evento</h4>
              <div className="participation-grid">
                {participationData.map((item, index) => (
                  <div key={index} className="participation-item">
                    <div className="participation-value">{item.value}</div>
                    <div className="participation-label">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h4><i className="icon-chart-pie"></i> Distribución de Presupuesto</h4>
              <div className="budget-distribution">
                <div className="pie-placeholder">
                  <div className="pie-slice pie-slice-1"></div>
                  <div className="pie-slice pie-slice-2"></div>
                  <div className="pie-slice pie-slice-3"></div>
                  <div className="pie-slice pie-slice-4"></div>
                </div>
                <div className="legend">
                  {budgetDistribution.map((slice, index) => (
                    <div key={index} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: slice.color }}></span>
                      {slice.label} ({slice.percentage}%)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Eventos Más Exitosos */}
          <div className="section-row">
            <div className="section-card">
              <h4><i className="icon-trophy"></i> Top 5 Eventos Más Exitosos</h4>
              <table className="top-events-table">
                <thead>
                  <tr>
                    <th>EVENTO</th>
                    <th>PARTICIPANTES</th>
                    <th>SATISFACCIÓN</th>
                    <th>COSTO</th>
                  </tr>
                </thead>
                <tbody>
                  {topEvents.map((event, index) => (
                    <tr key={index}>
                      <td>
                        <span className="medal-icon">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index === 3 && '🏅'}
                          {index === 4 && '🎖️'}
                        </span>
                        {event.name}
                      </td>
                      <td>{event.participants}</td>
                      <td>
                        {event.satisfaction} <span className="star">⭐</span>
                      </td>
                      <td>{event.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Generar Reportes */}
            <div className="section-card">
              <h4><i className="icon-report"></i> Generar Reportes</h4>
              <div className="reports-grid">
                <div className="report-item">
                  <button type="button" className="report-btn report-btn-primary" onClick={() => generateReport('complete')}>
                    <i className="icon-file"></i> Reporte Completo
                  </button>
                </div>
                <div className="report-item">
                  <button type="button" className="report-btn report-btn-success" onClick={() => generateReport('financial')}>
                    <i className="icon-money"></i> Reporte Financiero
                  </button>
                </div>
                <div className="report-item">
                  <button type="button" className="report-btn report-btn-info" onClick={() => generateReport('participation')}>
                    <i className="icon-users"></i> Reporte Participación
                  </button>
                </div>
                <div className="report-item">
                  <button type="button" className="report-btn report-btn-warning" onClick={() => generateReport('trends')}>
                    <i className="icon-trend"></i> Tendencias
                  </button>
                </div>
              </div>

              <div className="export-format">
                <label>Formato de exportación:</label>
                <div className="format-buttons">
                  <button type="button" className="export-btn">PDF</button>
                  <button type="button" className="export-btn">Excel</button>
                  <button type="button" className="export-btn">CSV</button>
                  <button type="button" className="export-btn export-btn-primary">Descargar</button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Periodo */}
          <div className="summary-section">
            <div className="summary-content">
              <i className="icon-summary"></i>
              <strong>Resumen del Periodo:</strong>
              <span>
                {stats.events} eventos realizados • {stats.participants} participantes • {stats.attendanceRate}% tasa asistencia • Q{stats.budgetSpent.toLocaleString()} ejecutado • {stats.satisfaction}/5 satisfacción promedio
              </span>
            </div>
            <button className="btn btn-success">Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;