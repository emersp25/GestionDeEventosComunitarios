import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InputField from '../UI/InputField.jsx';
import SelectField from '../UI/SelectField.jsx';
import TextareaField from '../UI/TextareaField.jsx';
import FormSection from '../UI/FormSection.jsx';
import { alertErrorsList, alertSuccess, alertError } from '../../utils/alerts.js';
import { getEvents } from '../../api/events.js';
import { createBudgetRequest } from '../../api/budgets.js';

export default function CreateBudgetForm() {
  const [form, setForm] = useState({
    originId: 1,
    name: '',
    email: '',
    requestAmount: '',
    priorityId: '',
    reason: ''
  });

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');

  const ORIGIN_DEFAULT = 0;

  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvents();
        if (!mounted) return;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar eventos para presupuesto:', err);
        alertError('Error al cargar eventos', err.message || 'Error desconocido');
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const st = location?.state;
    if (st && st.eventNombre) {
      setForm(prev => ({ ...prev, name: st.eventNombre }));
    }
    if (st && st.eventId) {
      setSelectedEventId(st.eventId);
    }
  }, [location?.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventSelect = (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    const ev = events.find((x) => String(x.id) === String(eventId));
    if (ev && ev.nombre) {
      setForm((prev) => ({ ...prev, name: ev.nombre }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    const name = (form.name || '').trim();
    if (!name) errors.push('Nombre: es requerido.');

    const reason = (form.reason || '').trim();
    if (!reason) errors.push('Motivo/razón: es requerido.');

    const email = (form.email || '').trim();
    if (!email) errors.push('Email: es requerido.');
    else if (!validateEmail(email)) errors.push('Email: formato inválido.');

    const amount = parseFloat(form.requestAmount);
    if (isNaN(amount) || amount <= 0) errors.push('Monto solicitado: debe ser un número mayor a 0.');

    const priority = parseInt(form.priorityId, 10);
    if (isNaN(priority)) errors.push('Prioridad: es requerida.');
    else if (priority < 1 || priority > 3) errors.push('Prioridad: debe ser 1, 2 o 3.');

    if (errors.length > 0) {
      await alertErrorsList('Revisa los campos', errors);
      return;
    }

    const payload = {
      originId: 1,
      requestAmount: amount,
      name,
      reason,
      email,
      priorityId: priority
    };

    try {
      await createBudgetRequest(payload);
      await alertSuccess('Presupuesto guardado', 'La solicitud de presupuesto fue enviada correctamente.');
      setForm({
        name: '',
        email: '',
        requestAmount: '',
        priorityId: '',
        reason: ''
      });
      setSelectedEventId('');
    } catch (err) {
      console.error('Error al crear solicitud de presupuesto:', err);
      await alertError('Error al crear presupuesto', err.message || 'Error desconocido');
    }
  };

  const handleCancel = () => {
    setForm({
      name: '',
      email: '',
      requestAmount: '',
      priorityId: '',
      reason: ''
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear Presupuesto</h3>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="card-body">
          <FormSection
            title="Datos de la Solicitud"
            subtitle="Complete los campos obligatorios (*)"
          />

          <div className="form-row form-row-gap">
            <SelectField
              label="Evento"
              name="selectedEventId"
              required
              value={selectedEventId}
              onChange={handleEventSelect}
              placeholder="Seleccione un evento para autocompletar el Nombre"
              options={events.map(ev => ({ value: ev.id, label: ev.nombre }))}
              groupClass="form-group col-md-6"
              helpText="Al elegir un evento se completa automáticamente el campo Nombre con el nombre del evento."
            />
          </div>

          <div className="form-row form-row-gap">
            <InputField
              label="Nombre"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre del evento o solicitante"
              groupClass="form-group col-md-6"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="correo@dominio.com"
              helpText="Debe ser un email válido."
              groupClass="form-group col-md-6"
            />
          </div>

          <div className="form-row form-row-gap">
            <InputField
              label="Monto Solicitado (Q)"
              name="requestAmount"
              type="number"
              required
              min={0.01}
              step={0.01}
              value={form.requestAmount}
              onChange={handleChange}
              helpText="Debe ser mayor a 0.00"
              groupClass="form-group col-md-6"
            />
            <SelectField
              label="Prioridad"
              name="priorityId"
              required
              value={form.priorityId}
              onChange={handleChange}
              placeholder="Seleccione prioridad"
              options={[
                { value: 1, label: '1 - Alta' },
                { value: 2, label: '2 - Media' },
                { value: 3, label: '3 - Baja' }
              ]}
              groupClass="form-group col-md-6"
            />
          </div>

          <FormSection title="Motivo" showDivider={false} />
          <div className="form-row form-row-gap">
            <TextareaField
              label="Razón / Descripción"
              name="reason"
              required
              value={form.reason}
              onChange={handleChange}
              charLimit={1000}
              placeholder="Explique brevemente el motivo del presupuesto"
              groupClass="form-group col-12"
            />
          </div>

          {/* Campo oculto: originId por defecto = 1 (solo para referencia; no es necesario si el backend lo asume por defecto) */}
          <input type="hidden" name="originId" value={ORIGIN_DEFAULT} readOnly />
        </div>

        <div className="card-footer">
          <div className="form-actions">
            <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar presupuesto
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
