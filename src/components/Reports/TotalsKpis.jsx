import React from 'react';

function numberFormat(n) {
  if (n == null || Number.isNaN(Number(n))) return '0';
  try {
    return Number(n).toLocaleString('es-ES');
  } catch {
    return String(n);
  }
}

function displayVal(n) {
  return n == null ? '-' : numberFormat(n);
}

export default function TotalsKpis({ totals }) {
  const totalEventosRealizados = totals?.totalEventosRealizados;
  const totalParticipantes = totals?.totalParticipantes;
  const presupuestoEjecutado = totals?.presupuestoEjecutado;

  return (
    <div className="row">
      <div className="col-12 col-md-4 mb-3">
        <div className="card text-center">
          <div className="card-body">
            <div className="h5 mb-1">Eventos realizados</div>
            <div className="display-6 font-weight-bold">{displayVal(totalEventosRealizados)}</div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4 mb-3">
        <div className="card text-center">
          <div className="card-body">
            <div className="h5 mb-1">Total participantes</div>
            <div className="display-6 font-weight-bold">{displayVal(totalParticipantes)}</div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4 mb-3">
        <div className="card text-center">
          <div className="card-body">
            <div className="h5 mb-1">Presupuesto ejecutado</div>
            <div className="display-6 font-weight-bold">{displayVal(presupuestoEjecutado)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
