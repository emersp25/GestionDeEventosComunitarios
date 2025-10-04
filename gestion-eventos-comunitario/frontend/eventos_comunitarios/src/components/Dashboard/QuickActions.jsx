import React from 'react';

const QuickActions = () => {
  return (
    <div className="quick-actions">
      <button className="btn btn-primary">
        <span>➕</span> Nuevo Evento
      </button>
      <button className="btn btn-success">
        <span>📊</span> Ver Reportes
      </button>
      <button className="btn btn-secondary">
        <span>📅</span> Calendario
      </button>
    </div>
  );
};

export default QuickActions;