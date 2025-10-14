import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-item">
        <span>📊</span>
        Dashboard
      </Link>
      <Link to="/register-event" className="sidebar-item">
        <span>➕</span>
        Registrar Evento
      </Link>
      <Link to= "/inscription-event" className="sidebar-item">
        <span>📋</span>
        Inscripciones
      </Link>
      <Link to= "/budgets-event" className="sidebar-item">
      <span>💰</span>
        Presupuestos
        </Link>    
      <Link to= "/reports-event" className="sidebar-item">
        <span>📈</span>
        Reportes
      </Link>
      <Link to="/calendar-event" className="sidebar-item">
        <span>📅</span>
        Calendario
      </Link>
    </div>
  );
};

export default Sidebar;