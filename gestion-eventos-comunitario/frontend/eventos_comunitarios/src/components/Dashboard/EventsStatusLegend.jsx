import React from 'react';

const EventStatusLegend = () => {
  return (
    <div className="card">
      <h4>Estados del Evento</h4>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="status-badge status-active">Activo</span>
          <span>Aprobado y funcionando</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="status-badge status-pending">Pendiente</span>
          <span>Esperando aprobación</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-badge status-rejected">Rechazado</span>
          <span>No aprobado por finanzas</span>
        </div>
      </div>
    </div>
  );
};

export default EventStatusLegend;