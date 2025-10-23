import { useMemo, useState } from 'react';
import InputField from '../UI/InputField.jsx';
import TextareaField from '../UI/TextareaField.jsx';
import FormSection from '../UI/FormSection.jsx';
import { createEvent } from '../../api/events.js';
import { alertErrorsList, alertSuccess, alertError } from '../../utils/alerts.js';


function toLocalInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateEventForm() {
  const nowMin = useMemo(() => toLocalInputValue(new Date()), []);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    capacidadMaxima: '',
    organizador: '',
    presupuestoSolicitado: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    const nombre = (form.nombre || '').trim();
    if (nombre.length < 3 || nombre.length > 200) {
      errors.push('Nombre del evento: debe tener entre 3 y 200 caracteres.');
    }

    const descripcion = form.descripcion || '';
    if (descripcion.length > 1000) {
      errors.push('Descripción: máximo 1000 caracteres.');
    }

    if (!form.fechaInicio) {
      errors.push('Fecha y hora de inicio: es requerida.');
    }
    if (!form.fechaFin) {
      errors.push('Fecha y hora de fin: es requerida.');
    }
    let start = null;
    let end = null;
    const now = new Date();
    if (form.fechaInicio) {
      start = new Date(form.fechaInicio);
      if (!(start instanceof Date) || isNaN(start.getTime())) {
        errors.push('Fecha y hora de inicio: formato inválido.');
      } else if (start <= now) {
        errors.push('Fecha y hora de inicio: debe ser en el futuro.');
      }
    }
    if (form.fechaFin) {
      end = new Date(form.fechaFin);
      if (!(end instanceof Date) || isNaN(end.getTime())) {
        errors.push('Fecha y hora de fin: formato inválido.');
      } else if (start && end <= start) {
        errors.push('Fecha y hora de fin: debe ser posterior al inicio.');
      }
    }

    const ubicacion = (form.ubicacion || '').trim();
    if (ubicacion.length === 0 || ubicacion.length > 300) {
      errors.push('Ubicación: requerida, máximo 300 caracteres.');
    }

    const org = (form.organizador || '').trim();
    if (org.length === 0 || org.length > 200) {
      errors.push('Organizador: requerido, máximo 200 caracteres.');
    }

    const cap = parseInt(form.capacidadMaxima, 10);
    if (isNaN(cap) || cap < 1 || cap > 10000) {
      errors.push('Capacidad Máxima: entero entre 1 y 10000.');
    }

    const presupuesto = parseFloat(form.presupuestoSolicitado);
    if (isNaN(presupuesto) || presupuesto < 0) {
      errors.push('Presupuesto Solicitado: número mayor o igual a 0.00.');
    }

    if (errors.length > 0) {
      await alertErrorsList('Revisa los campos', errors);
      return;
    }

 
    const payload = {
      nombre,
      descripcion,
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      fechaFin: new Date(form.fechaFin).toISOString(),
      ubicacion,
      capacidadMaxima: cap,
      organizador: org,
      presupuestoSolicitado: presupuesto
    };
    try {
      await createEvent(payload);
      await alertSuccess('Evento creado', 'El evento fue creado correctamente.');
      setForm({
        nombre: '',
        descripcion: '',
        fechaInicio: '',
        fechaFin: '',
        ubicacion: '',
        capacidadMaxima: '',
        organizador: '',
        presupuestoSolicitado: ''
      });
    } catch (err) {
      
      console.error('Error al crear evento:', err);
      await alertError('Error al crear evento', err.message || 'Error desconocido');
    }
  };

  const handleCancel = () => {
    setForm({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      ubicacion: '',
      capacidadMaxima: '',
      organizador: '',
      presupuestoSolicitado: ''
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Registrar Nuevo Evento Comunitario</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <FormSection
            title="Información General"
            subtitle="Complete los campos obligatorios (*)"
          />

          <div className="form-row form-row-gap">
            <InputField
              label="Nombre del Evento"
              name="nombre"
              required
              minLength={3}
              maxLength={200}
              value={form.nombre}
              onChange={handleChange}
              helpText="Entre 3 y 200 caracteres."
              groupClass="form-group col-md-6"
            />
            <InputField
              label="Organizador"
              name="organizador"
              required
              maxLength={200}
              value={form.organizador}
              onChange={handleChange}
              helpText="Nombre del responsable/entidad (máx. 200)."
              groupClass="form-group col-md-6"
            />
          </div>

          <FormSection
            title="Programación"
            subtitle="Defina el inicio (futuro) y la finalización"
          />

          <div className="form-row form-row-gap">
            <InputField
              label="Fecha y Hora de Inicio"
              name="fechaInicio"
              type="datetime-local"
              required
              min={nowMin}
              value={form.fechaInicio}
              onChange={handleChange}
              helpText="Debe ser una fecha y hora futura."
              groupClass="form-group col-md-6"
            />
            <InputField
              label="Fecha y Hora de Fin"
              name="fechaFin"
              type="datetime-local"
              required
              min={form.fechaInicio || nowMin}
              value={form.fechaFin}
              onChange={handleChange}
              helpText="Debe ser posterior al inicio."
              groupClass="form-group col-md-6"
            />
          </div>

          <FormSection
            title="Ubicación y Capacidad"
          />

          <div className="form-row form-row-gap">
            <InputField
              label="Ubicación"
              name="ubicacion"
              required
              maxLength={300}
              value={form.ubicacion}
              onChange={handleChange}
              helpText="Dirección o lugar del evento (máx. 300)."
              groupClass="form-group col-12"
            />
          </div>

          <div className="form-row form-row-gap">
            <InputField
              label="Capacidad Máxima"
              name="capacidadMaxima"
              type="number"
              required
              min={1}
              max={10000}
              step={1}
              value={form.capacidadMaxima}
              onChange={handleChange}
              helpText="Número entero entre 1 y 10,000."
              groupClass="form-group col-md-6"
            />
            <InputField
              label="Presupuesto Solicitado (Q)"
              name="presupuestoSolicitado"
              type="number"
              required
              min={0}
              step={0.01}
              value={form.presupuestoSolicitado}
              onChange={handleChange}
              helpText="Monto mayor o igual a 0.00."
              groupClass="form-group col-md-6"
            />
          </div>

          <FormSection title="Detalles del Evento" showDivider={false} />

          <div className="form-row form-row-gap">
            <TextareaField
              label="Descripción del Evento"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              charLimit={1000}
              helpText="Opcional. Máximo 1000 caracteres."
              groupClass="form-group col-12"
            />
          </div>
        </div>

        <div className="card-footer">
          <div className="form-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar evento
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
