import React from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import StatsCard from '../components/Dashboard/StatsCard';
import QuickActions from '../components/Dashboard/QuickActions';
import RecentEventsTable from '../components/Dashboard/RecentEventsTable';
import EventStatusLegend from '../components/Dashboard/EventsStatusLegend';
import RecentNotifications from '../components/Notifications/RecentNotifications';

const DashboardPage = () => {
  const stats = [
    { title: "Eventos Activos", value: 12, change: "+2 esta semana", color: "#28a745" },
    { title: "Total Inscritos", value: 248, change: "+15 hoy", color: "#1976d2" },
    { title: "Presupuesto Pendiente", value: "Q250,000", change: "3 solicitudes", color: "#ffc107" },
  ];

  const events = [
    { name: "Feria Gastronómica", date: "25 Oct 2025", inscriptions: "45/60", status: "activo", budget: "Q9,000" },
    { name: "Festival de Música", date: "30 Oct 2025", inscriptions: "78/100", status: "pendiente", budget: "Q8,000" },
    { name: "Taller de Manualidades", date: "02 Nov 2025", inscriptions: "15/25", status: "rechazado", budget: "Q3,000" },
  ];

  const notifications = [
    "Presupuesto del Festival de Música aprobado",
    "5 nuevas inscripciones para Feria Gastronómica",
    "Recordatorio: Evento mañana a las 10:00 AM"
  ];

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="section-title">Dashboard - Eventos Comunitarios</h1>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="card">
          <h3>Acciones Rápidas</h3>
          <QuickActions />
        </div>

        <div className="card">
          <h3>Eventos Recientes</h3>
          <RecentEventsTable events={events} />
        </div>

        <div className="card">
          <div className="form-row">
            <div className="form-col">
              <EventStatusLegend />
            </div>
            <div className="form-col">
              <RecentNotifications notifications={notifications} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;