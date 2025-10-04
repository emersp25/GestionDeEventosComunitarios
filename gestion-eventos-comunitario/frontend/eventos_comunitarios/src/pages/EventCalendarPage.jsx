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

  // Simulamos datos de eventos (en producción, esto vendría de una API)
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: 'Taller',
        start: '2025-10-05T10:00:00',
        end: '2025-10-05T11:00:00',
        description: 'Taller de manualidades',
        location: 'Plaza Central',
        status: 'confirmed', // confirmed, pending, in-progress
      },
      {
        id: '2',
        title: 'Reunión',
        start: '2025-10-10T14:00:00',
        end: '2025-10-10T15:00:00',
        description: 'Reunión comunitaria',
        location: 'Centro Comunitario',
        status: 'in-progress',
      },
      {
        id: '3',
        title: 'Feria Gastronómica',
        start: '2025-10-25T10:00:00',
        end: '2025-10-25T18:00:00',
        description: 'Feria de comida local',
        location: 'Parque Municipal',
        status: 'pending',
      },
      {
        id: '4',
        title: 'Festival de Música',
        start: '2025-10-30T18:00:00',
        end: '2025-10-30T22:00:00',
        description: 'Conciertos en vivo',
        location: 'Parque Municipal',
        status: 'confirmed',
      },
      {
        id: '5',
        title: 'Charla Educativa',
        start: '2025-11-05T16:00:00',
        end: '2025-11-05T17:00:00',
        description: 'Educación financiera',
        location: 'Biblioteca',
        status: 'confirmed',
      },
      {
        id: '6',
        title: 'Conferencia Salud',
        start: '2025-11-08T14:30:00',
        end: '2025-11-08T16:00:00',
        description: 'Salud mental y bienestar',
        location: 'Centro de Salud',
        status: 'confirmed',
      },
    ];

    setEvents(mockEvents);
  }, []);

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
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
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