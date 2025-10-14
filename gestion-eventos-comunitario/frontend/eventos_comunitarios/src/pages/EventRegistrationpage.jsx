import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import '../styles/EventRegistration.css';

const EventRegistrationPage = () => {
  const [formData, setFormData] = useState({
  name: '',
  eventType: '',
  date: '',
  startTime: '',
  duration: '',
  endTime: '',
  location: '',
  fullAddress: '',
  capacity: '',
  isFree: false,
  contactPhone: '',
  email: '',
  estimatedCost: '0.00',
  description: '',
  allowWaitlist: false,
  sendReminders: false,
  isPublic: true,
  requiresApproval: false,
  categories: {
  cultural: true,
  sports: false,
  educational: false,
  }
});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
     if (type === 'checkbox') {
    if (name.startsWith('categories.')) {
      const category = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        categories: { ...prev.categories, [category]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Evento registrado!');
   
  };

 return (
  <div className="container-event">
    <Sidebar />
    <div className="main-content">
      <Header />
      <h1 className="section-title">Registrar Nuevo Evento Comunitario</h1>
      <p className="section-subtitle">Complete todos los campos para crear un nuevo evento</p>


{/* Extra ------------*/}
<div className="card">
  <div className="form-and-panels-container">

    {/* Formulario (izquierda) */}
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        {/* Información del Evento */}
        <div className="section-header">
          <h3>Información del Evento</h3>
          <span className="example">Ej: Feria Gastronómica de Primavera</span>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Nombre del Evento *</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Ej: Feria Gastronómica de Primavera"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Tipo de Evento *</label>
            <select
              name="eventType"
              className="form-input"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Deportivo</option>
              <option value="educational">Educativo</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Fecha del Evento *</label>
            <input
              type="text"
              name="date"
              className="form-input"
              placeholder="DD/MM/YYYY"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Hora de Inicio *</label>
            <input
              type="text"
              name="startTime"
              className="form-input"
              placeholder="HH:MM"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Duración (horas)</label>
            <input
              type="number"
              name="duration"
              className="form-input"
              step="0.5"
              min="0.5"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>
          <div className="form-col">
            <label className="form-label">Hora Fin</label>
            <input
              type="text"
              name="endTime"
              className="form-input"
              placeholder="HH:MM"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Lugar del Evento *</label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="Ej: Plaza Central, Parque Municipal"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Dirección Completa</label>
            <input
              type="text"
              name="fullAddress"
              className="form-input"
              placeholder="Calle, número, colonia..."
              value={formData.fullAddress}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Capacidad Máxima *</label>
            <input
              type="number"
              name="capacity"
              className="form-input"
              placeholder="100 personas"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Inscripción Gratuita</label>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="isFree"
                id="isFree"
                checked={formData.isFree}
                onChange={handleChange}
              />
              <label htmlFor="isFree" className="checkbox-label">Marcar si es gratuito</label>
            </div>
          </div>
          <div className="form-col">
            <label className="form-label">Teléfono Contacto</label>
            <input
              type="text"
              name="contactPhone"
              className="form-input"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-col">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Presupuesto Estimado */}
        <div className="section-header">
          <h3>Presupuesto Estimado</h3>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label">Costo Total Estimado (Q) *</label>
            <input
              type="number"
              name="estimatedCost"
              className="form-input"
              step="0.01"
              value={formData.estimatedCost}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-col">
            <label className="form-label">Solicitar a Finanzas</label>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="autoRequestFinances"
                id="autoRequestFinances"
                checked={true} // siempre activado según la imagen
                disabled
              />
              <label htmlFor="autoRequestFinances" className="checkbox-label">Automático al guardar</label>
            </div>
          </div>
        </div>

        <p className="info-text">
          Se enviará solicitud automática al Departamento de Finanzas
        </p>

        {/* Descripción del Evento */}
        <div className="form-group">
          <label className="form-label">Descripción del Evento *</label>
          <textarea
            name="description"
            className="form-textarea"
            rows="4"
            placeholder="Describa brevemente el evento, objetivos, actividades principales, público objetivo y cualquier información relevante..."
            value={formData.description}
            onChange={handleChange}
            maxLength="500"
          />
          <div className="char-count">
            Máximo 500 caracteres ({formData.description.length}/500)
          </div>
        </div>

        {/* Botones */}
        <div className="form-row" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
          <button type="button" className="btn btn-outline">Borrador</button>
          <button type="button" className="btn btn-danger">Cancelar</button>
          <button type="submit" className="btn btn-success">Guardar</button>
        </div>
      </form>
    </div>

    {/* Paneles (derecha) */}
    <div className="panels-wrapper">
      <div className="options-panel">
        <h4><i className="icon-settings"></i> Opciones</h4>
        <div className="option-item">
          <input
            type="checkbox"
            name="allowWaitlist"
            id="allowWaitlist"
            checked={formData.allowWaitlist}
            onChange={handleChange}
          />
          <label htmlFor="allowWaitlist">Permitir lista de espera</label>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            name="sendReminders"
            id="sendReminders"
            checked={formData.sendReminders}
            onChange={handleChange}
          />
          <label htmlFor="sendReminders">Enviar recordatorios</label>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
          />
          <label htmlFor="isPublic">Evento público</label>
        </div>
        <div className="option-item">
          <input
            type="checkbox"
            name="requiresApproval"
            id="requiresApproval"
            checked={formData.requiresApproval}
            onChange={handleChange}
          />
          <label htmlFor="requiresApproval">Requiere autorización</label>
        </div>

        <h5>Categorías:</h5>
        <div className="category-list">
          <div className="category-item">
            <input
              type="checkbox"
              name="categories.cultural"
              id="category-culture"
              checked={formData.categories.cultural}
              onChange={handleChange}
            />
            <label htmlFor="category-culture" className="category-label cultural">Cultural</label>
          </div>
          <div className="category-item">
            <input
              type="checkbox"
              name="categories.sports"
              id="category-sports"
              checked={formData.categories.sports}
              onChange={handleChange}
            />
            <label htmlFor="category-sports" className="category-label sports">Deportivo</label>
          </div>
          <div className="category-item">
            <input
              type="checkbox"
              name="categories.educational"
              id="category-edu"
              checked={formData.categories.educational}
              onChange={handleChange}
            />
            <label htmlFor="category-edu" className="category-label educational">Educativo</label>
          </div>
        </div>
      </div>

      <div className="help-panel">
        <h4><i className="icon-info"></i> Ayuda</h4>
        <p>Consejos para crear eventos exitosos:</p>
        <ul>
          <li>Nombre claro y atractivo</li>
          <li>Fecha con suficiente antelación</li>
          <li>Ubicación accesible</li>
          <li>Presupuesto realista</li>
          <li>Descripción detallada</li>
        </ul>

        <h5>Estados del Evento:</h5>
        <div className="status-indicators">
          <div className="status-item">
            <span className="status-dot draft"></span>
            <span>Borrador</span>
          </div>
          <div className="status-item">
            <span className="status-dot pending"></span>
            <span>Pendiente</span>
          </div>
          <div className="status-item">
            <span className="status-dot approved"></span>
            <span>Aprobado</span>
          </div>
          <div className="status-item">
            <span className="status-dot rejected"></span>
            <span>Rechazado</span>
          </div>
        </div>

        <p>Una vez guardado, se enviará automáticamente la solicitud de presupuesto al Dpto. de Finanzas.</p>
        <p>Tiempo estimado de respuesta: 2-3 días hábiles.</p>

        <button className="btn btn-primary help-btn">
          <i className="icon-phone"></i> Contactar Soporte
        </button>
      </div>
    </div>

  </div>

  {/* Próximos Eventos (fuera del contenedor de form + paneles) */}
  <div className="next-events-section">
    <h3>Próximos Eventos</h3>
    <ul className="event-list">
      
    </ul>
    <button className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>
      Ver Calendario Completo
    </button>
  </div>
</div>




     
    </div>
  </div>
);
}
export default EventRegistrationPage;