import React from 'react';

export default function EventSelector({ events = [], selected, onChange }) {
  return (
    <div className="form-group col-md-6">
      <label>Selecciona evento</label>
      <select
        className="form-control"
        value={selected || ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">— Seleccionar —</option>
        {Array.isArray(events) && events.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.nombre || ev.id}
          </option>
        ))}
      </select>
    </div>
  );
}
