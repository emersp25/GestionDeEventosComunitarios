import React from 'react';

const RecentEventsTable = ({ events }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>EVENTO</th>
            <th>FECHA</th>
            <th>INSCRITOS</th>
            <th>ESTADO</th>
            <th>PRESUPUESTO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.inscriptions}</td>
              <td>
                <span className={`status-badge status-${event.status}`}>
                  {event.status === 'activo' ? 'Activo' : 
                   event.status === 'pendiente' ? 'Pendiente' : 'Rechazado'}
                </span>
              </td>
              <td>{event.budget}</td>
              <td>⋯</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentEventsTable;