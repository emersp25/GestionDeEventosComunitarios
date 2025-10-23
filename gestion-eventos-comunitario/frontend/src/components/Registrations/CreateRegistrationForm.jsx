import { useState, useEffect } from 'react';
import InputField from '../UI/InputField.jsx';
import SelectField from '../UI/SelectField.jsx';
import TextareaField from '../UI/TextareaField.jsx';
import FormSection from '../UI/FormSection.jsx';
import { alertErrorsList, alertSuccess, alertError } from '../../utils/alerts.js';
import { getEvents } from '../../api/events.js';
import { createRegistration } from '../../api/registrations.js';

/**
 * CreateRegistrationForm (Inscripciones)
 * Campos:
 * - eventId (dropdown con dummy info por ahora)
 * - participanteNombre (required)
 * - participanteEmail (required, email)
 * - participanteTelefono (required, validación básica)
 * - notasAdicionales (opcional, máx 500)
 */
export default function CreateRegistrationForm() {
  const [form, setForm] = useState({
    eventId: '',
    participanteNombre: '',
    participanteEmail: '',
    participanteTelefono: '',
    notasAdicionales: ''
  });

  const [eventOptions, setEventOptions] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getEvents();
        if (!mounted) return;
        const opts = (Array.isArray(data) ? data : []).map((ev) => ({
          value: ev.id,
          label: ev.nombre
        }));
        setEventOptions(opts);
      } catch (err) {
        
        console.error('Error al cargar eventos para inscripciones:', err);
        alertError('Error al cargar eventos', err.message || 'Error desconocido');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (!form.eventId) errors.push('Evento: seleccione una opción.');

    const nombre = (form.participanteNombre || '').trim();
    if (nombre.length < 2) errors.push('Nombre del participante: mínimo 2 caracteres.');

    const email = (form.participanteEmail || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.push('Email del participante: formato inválido.');

    const tel = (form.participanteTelefono || '').trim();
    const telRegex = /^[0-9+\-\s()]{7,20}$/; // dígitos, espacios, +, -, ()
    if (!telRegex.test(tel)) errors.push('Teléfono del participante: use solo dígitos, espacios, +, -, ().');

    const notas = form.notasAdicionales || '';
    if (notas.length > 500) errors.push('Notas adicionales: máximo 500 caracteres.');

    if (errors.length) {
      await alertErrorsList('Revisa los campos', errors);
      return;
    }

    const payload = {
      eventId: form.eventId,
      participanteNombre: nombre,
      participanteEmail: email,
      participanteTelefono: tel,
      notasAdicionales: notas
    };

    try {
      await createRegistration(payload);
      await alertSuccess('Inscripción guardada', 'La inscripción se registró correctamente.');
      setForm({
        eventId: '',
        participanteNombre: '',
        participanteEmail: '',
        participanteTelefono: '',
        notasAdicionales: ''
      });
    } catch (err) {
      
      console.error('Error al crear inscripción:', err);
      await alertError('Error al crear inscripción', err.message || 'Error desconocido');
    }
  };

  const handleCancel = () => {
    setForm({
      eventId: '',
      participanteNombre: '',
      participanteEmail: '',
      participanteTelefono: '',
      notasAdicionales: ''
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Registrar Inscripción</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <FormSection
            title="Evento"
            subtitle="Seleccione el evento al que desea inscribir"
          />
          <div className="form-row form-row-gap">
            <SelectField
              label="Evento"
              name="eventId"
              options={eventOptions}
              required
              value={form.eventId}
              onChange={handleChange}
              groupClass="form-group col-md-6"
              helpText="Opciones cargadas desde el backend."
            />
          </div>

          <FormSection
            title="Datos del Participante"
            subtitle="Complete la información del participante"
          />
          <div className="form-row form-row-gap">
            <InputField
              label="Nombre del Participante"
              name="participanteNombre"
              required
              minLength={2}
              maxLength={200}
              value={form.participanteNombre}
              onChange={handleChange}
              helpText="Nombre completo del participante."
              groupClass="form-group col-md-6"
            />
            <InputField
              label="Email del Participante"
              name="participanteEmail"
              type="email"
              required
              maxLength={200}
              value={form.participanteEmail}
              onChange={handleChange}
              helpText="Correo electrónico válido."
              groupClass="form-group col-md-6"
            />
          </div>

          <div className="form-row form-row-gap">
            <InputField
              label="Teléfono del Participante"
              name="participanteTelefono"
              type="tel"
              required
              maxLength={20}
              pattern="[0-9+\-\s()]{7,20}"
              value={form.participanteTelefono}
              onChange={handleChange}
              helpText="Use dígitos y símbolos permitidos: + - ( )"
              groupClass="form-group col-md-6"
            />
          </div>

          <FormSection title="Notas Adicionales" showDivider={false} />
          <div className="form-row form-row-gap">
            <TextareaField
              label="Notas Adicionales"
              name="notasAdicionales"
              value={form.notasAdicionales}
              onChange={handleChange}
              charLimit={500}
              helpText="Opcional. Máximo 500 caracteres."
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
              Guardar inscripción
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
