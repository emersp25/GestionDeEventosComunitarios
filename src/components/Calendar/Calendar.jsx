import React, { useMemo, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../style/Calendar.css';
import { getCalendarEvents } from '../../api/events.js';
import { alertError } from '../../utils/alerts.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function getMonthMatrix(current) {
  const firstOfMonth = new Date(current.getFullYear(), current.getMonth(), 1);
  const startWeekDay = firstOfMonth.getDay(); 
  const gridStart = addDays(firstOfMonth, -startWeekDay); 

  const days = [];
  for (let i = 0; i < 42; i += 1) {
    const d = addDays(gridStart, i);
    days.push(d);
  }
  return days;
}

const dayLabels = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function calendarStatusClass(status) {
  switch (status) {
    case 'APROBADO':
      return 'badge badge-success';
    case 'RECHAZADO':
      return 'badge badge-danger';
    case 'PENDIENTE_APROBACION':
    default:
      return 'badge badge-warning';
  }
}

export default function Calendar() {
  const [current, setCurrent] = useState(startOfDay(new Date()));
  const today = useMemo(() => startOfDay(new Date()), []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getCalendarEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
 
      console.error('Error al cargar calendario:', err);
      await alertError('Error al cargar calendario', err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSync = () => { if (!loading) fetchEvents(); };

  const monthLabel = useMemo(() => {
    try {
      const fmt = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
      return fmt.format(current).replace(/^\w/, (c) => c.toUpperCase());
    } catch (e) {
      const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${months[current.getMonth()]} ${current.getFullYear()}`;
    }
  }, [current]);

  const days = useMemo(() => getMonthMatrix(current), [current]);
  const thisMonth = current.getMonth();
  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const eventsToday = useMemo(() => {
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    return [...events]
      .filter(ev => {
        const d = new Date(ev.fechaInicio);
        return sameDay(d, today);
      })
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
  }, [events, today]);

  const upcomingEvents = useMemo(() => {
    const start = startOfDay(today);
    return [...events]
      .filter(ev => {
        const d = new Date(ev.fechaInicio);
        return d >= start && !(d.getFullYear() === start.getFullYear() && d.getMonth() === start.getMonth() && d.getDate() === start.getDate());
      })
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio))
      .slice(0, 5);
  }, [events, today]);

  const handlePrev = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const handleNext = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const handleToday = () => setCurrent(startOfDay(new Date()));

  return (
    <div className="calendar-page">
      {/* Encabezado */}
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <h2 className="m-0">Calendario de Eventos Comunitarios</h2>
        <NavLink to="/events/create" className="btn btn-success">
          <i className="fas fa-plus mr-2" />Nuevo Evento
        </NavLink>
      </div>
      <p className="text-muted mb-3">Visualización y gestión de todos los eventos programados</p>

      <div className="row">
        {/* Calendario principal */}
        <div className="col-lg-9 mb-3">
          <div className="card">
            <div className="card-body">
              {/* Toolbar */}
              <div className="d-flex align-items-center justify-content-between calendar-toolbar mb-3">
                <div className="btn-group" role="group" aria-label="Navegación">
                  <button type="button" className="btn btn-light" onClick={handlePrev} aria-label="Mes anterior">
                    <i className="fas fa-chevron-left" />
                  </button>
                  <button type="button" className="btn btn-light" onClick={handleNext} aria-label="Mes siguiente">
                    <i className="fas fa-chevron-right" />
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={handleToday}>today</button>
                </div>

                <div className="h5 m-0 font-weight-bold">{monthLabel}</div>

                <div className="btn-group" role="group" aria-label="Vistas">
                  <button type="button" className="btn btn-primary">month</button>
                  <button type="button" className="btn btn-light">week</button>
                  <button type="button" className="btn btn-light">day</button>
                </div>
              </div>

              {/* Encabezado de días */}
              <div className="calendar-grid calendar-grid-header">
                {dayLabels.map((l) => (
                  <div key={l} className="calendar-cell calendar-header text-primary">{l}</div>
                ))}
              </div>

              {/* Grilla del mes */}
              <div className="calendar-grid">
                {days.map((d, idx) => {
                  const outside = d.getMonth() !== thisMonth;
                  const isToday = isSameDay(d, today);
                  return (
                    <div
                      key={`${d.toISOString()}-${idx}`}
                      className={`calendar-cell ${outside ? 'outside-month' : ''} ${isToday ? 'calendar-today' : ''}`}
                    >
                      <div className="calendar-date text-muted">{d.getDate()}</div>
                      {(() => {
                        const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
                        const dayEvents = events
                          .filter(ev => {
                            const sd = new Date(ev.fechaInicio);
                            return sameDay(sd, d);
                          })
                          .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
                        const maxToShow = 3;
                        const toShow = dayEvents.slice(0, maxToShow);
                        return (
                          <div className="mt-1">
                            {toShow.map(ev => {
                              const start = new Date(ev.fechaInicio);
                              const time = isNaN(start) ? '' : start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              return (
                                <div key={ev.id} className={`d-block mb-1 ${calendarStatusClass(ev.status)}`} title={ev.descripcion || ev.nombre}>
                                  <span className="mr-1">{time}</span>
                                  <span>{ev.nombre}</span>
                                </div>
                              );
                            })}
                            {dayEvents.length > maxToShow && (
                              <div className="text-muted small">+{dayEvents.length - maxToShow} más</div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>

   
            <div className="card-footer d-flex align-items-center justify-content-between flex-wrap">
              <div className="mb-2 mb-sm-0">
                <span className="font-weight-bold mr-2">Vista Rápida:</span>
                <div className="btn-group mr-2" role="group" aria-label="Rangos rápidos">
                  <button type="button" className="btn btn-light">Esta Semana</button>
                  <button type="button" className="btn btn-light">Próx. Semana</button>
                  <button type="button" className="btn btn-light">Este Mes</button>
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSync} disabled={loading}>
                  <i className={`fas fa-sync-alt mr-2 ${loading ? 'fa-spin' : ''}`} />
                  {loading ? 'Sincronizando...' : 'Sincronizar'}
                </button>
              </div>
              <button type="button" className="btn btn-success">Notificar Cambios</button>
            </div>
          </div>
        </div>

      
        <div className="col-lg-3 mb-3">
          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="far fa-calendar-check mr-2" />
                Eventos de Hoy
              </h3>
            </div>
            <div className="card-body">
              {eventsToday.length === 0 ? (
                <p className="text-muted mb-0">No hay eventos programados para hoy</p>
              ) : (
                <ul className="list-unstyled mb-0 small">
                  {eventsToday.map(ev => {
                    const d = new Date(ev.fechaInicio);
                    const time = isNaN(d) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <li key={ev.id} className="mb-1 d-flex align-items-center">
                        <span className={`mr-2 ${calendarStatusClass(ev.status)}`} style={{ width: 10, height: 10, display: 'inline-block' }}></span>
                        <span className="text-truncate" title={ev.descripcion || ev.nombre}>
                          {time && <strong className="mr-1">{time}</strong>}
                          {ev.nombre}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="far fa-clock mr-2" />
                Próximos Eventos
              </h3>
            </div>
            <div className="card-body">
              {upcomingEvents.length === 0 ? (
                <ul className="list-unstyled mb-0 text-muted small"><li>No hay próximos eventos</li></ul>
              ) : (
                <ul className="list-unstyled mb-0 small">
                  {upcomingEvents.map(ev => {
                    const start = new Date(ev.fechaInicio);
                    const dateStr = isNaN(start) ? '' : start.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                    return (
                      <li key={ev.id} className="mb-1">
                        <div className="d-flex align-items-start">
                          <span className={`mr-2 mt-1 ${calendarStatusClass(ev.status)}`} style={{ width: 10, height: 10, display: 'inline-block' }}></span>
                          <div className="text-truncate" title={ev.descripcion || ev.nombre}>
                            <div className="font-weight-bold">{ev.nombre}</div>
                            <div className="text-muted small">{dateStr}</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title mb-0">
                <i className="fas fa-info-circle mr-2 text-primary" />
                Leyenda
              </h3>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="d-flex align-items-center mb-1">
                  <span className="legend-dot bg-success mr-2" /> Confirmado
                </li>
                <li className="d-flex align-items-center mb-1">
                  <span className="legend-dot bg-warning mr-2" /> Pendiente
                </li>
                <li className="d-flex align-items-center">
                  <span className="legend-dot bg-info mr-2" /> En Proceso
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
