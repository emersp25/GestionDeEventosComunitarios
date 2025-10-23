import React from 'react';


export default function StatsSummary({ total = 0, active = 0, confirmed = 0 }) {
  return (
    <div className="d-flex flex-wrap align-items-center">
      <div className="mr-4 mb-2">
        <div className="text-muted small">Total inscripciones</div>
        <div className="h5 mb-0">{total}</div>
      </div>
      <div className="mr-4 mb-2">
        <div className="text-muted small">Activas</div>
        <div className="h5 mb-0">{active}</div>
      </div>
      <div className="mr-4 mb-2">
        <div className="text-muted small">Confirmadas</div>
        <div className="h5 mb-0">{confirmed}</div>
      </div>
    </div>
  );
}
