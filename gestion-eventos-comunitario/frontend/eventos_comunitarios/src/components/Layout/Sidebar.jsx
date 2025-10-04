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
      <div className="sidebar-item">
        <span>📋</span>
        Inscripciones
      </div>
      <div className="sidebar-item">
        <span>💰</span>
        Presupuestos
      </div>
      <div className="sidebar-item">
        <span>📈</span>
        Reports
      </div>
      <Link to="/calendar-event" className="sidebar-item">
        <span>📅</span>
        Calendario
      </Link>
    </div>
  );
};

export default Sidebar;