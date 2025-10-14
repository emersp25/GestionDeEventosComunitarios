// src/pages/EventCalendarPage.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/EventCalendar.css';


const EventCalendarPage = () => {
  const [events, setEvents] = useState([]);


  // Función para mapear el estado a clase CSS
  const getEventClassNames = (arg) => {
    const event = arg.event;
    const status = event.extendedProps.status;

    switch (status) {
      case 'confirmed':
        return ['event-confirmed'];
      case 'pending':
        return ['event-pending'];
      case 'in-progress':
        return ['event-in-progress'];
      default:
        return [];
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <h1 className="section-title">Calendario de Eventos Comunitarios</h1>
        <p className="section-subtitle">Visualización y gestión de todos los eventos programados</p>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button className="btn btn-success">+ Nuevo Evento</button>
        </div>


{/* Contenedor principal: calendario + panel derecho */}
<div className="calendar-main-container">

  {/* Calendario (izquierda) */}
  <div className="calendar-wrapper">
    <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      titleFormat={{ month: 'long'}}
      events={events}
      eventClassNames={getEventClassNames}
      eventClick={(info) => {
        alert(`Evento: ${info.event.title}\n${info.event.extendedProps.description}`);
      }}
      locale="es"
      height="auto"
      contentHeight="auto"
    />
  </div>

  {/* Panel derecho (derecha) */}
  <div className="sidebar-panel">
    <div className="panel-section">
      <h4><i className="icon-calendar"></i> Eventos de Hoy</h4>
      <p>No hay eventos programados para hoy</p>
    </div>

    <div className="panel-section">
      <h4><i className="icon-clock"></i> Próximos Eventos</h4>
      <ul className="event-list">
        {events
          .filter(e => new Date(e.start) > new Date())
          .slice(0, 5)
          .map(event => (
            <li key={event.id} className={`event-item ${event.status}`}>
              <span className={`event-dot ${event.status}`}></span>
              <div>
                <strong>{event.title}</strong><br/>
                {new Date(event.start).toLocaleDateString()} • {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br/>
                {event.location}
              </div>
            </li>
          ))}
      </ul>
    </div>

    <div className="panel-section">
      <h4><i className="icon-info"></i> Leyenda</h4>
      <div className="legend-items">
        <div className="legend-item">
          <span className="legend-dot confirmed"></span>
          Confirmado
        </div>
        <div className="legend-item">
          <span className="legend-dot pending"></span>
          Pendiente
        </div>
        <div className="legend-item">
          <span className="legend-dot in-progress"></span>
          En Proceso
        </div>
      </div>
    </div>
  </div>

</div>



          {/* Vista Rápida y Sincronizar */}
          <div className="quick-view-bar">
            <div className="quick-view-label">Vista Rápida:</div>
            <div className="quick-view-buttons">
              <button className="btn btn-outline">Esta Semana</button>
              <button className="btn btn-outline">Próx. Semana</button>
              <button className="btn btn-outline">Este Mes</button>
              <button className="btn btn-primary">Sincronizar</button>
            </div>
            <button className="btn btn-success">Notificar Cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendarPage;