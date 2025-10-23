import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField.jsx';
import { register as registerRequest } from '../../api/auth.js';
import { alertError, alertSuccess } from '../../utils/alerts.js';


export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !password) {
      alertError('Datos incompletos', 'Nombre, email y contraseña son obligatorios.');
      return;
    }
    try {
      setLoading(true);
      const resp = await registerRequest({ nombre, email, password, telefono });
      const msg =
        (resp && (resp.message || (resp.data && resp.data.message))) ||
        'Registro realizado con éxito';
      await alertSuccess('Cuenta creada', msg);
      navigate('/login', { replace: true, state: { emailPrefill: email } });
    } catch (err) {
      const msg =
        (err && (err.message || (err.data && (err.data.error || err.data.message)))) ||
        'No se pudo completar el registro';
      alertError('Error al registrar', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="card card-outline card-primary">
              <div className="card-header text-center">
                <h3 className="card-title m-0">Crear cuenta</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <InputField
                      label="Nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      groupClass="form-group col-12"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="user@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      groupClass="form-group col-12"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Contraseña"
                      name="password"
                      type="password"
                      placeholder="••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      groupClass="form-group col-12"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Teléfono"
                      name="telefono"
                      type="tel"
                      placeholder="Opcional"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      groupClass="form-group col-12"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login">Inicia sesión</Link>
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/" className="btn btn-link">Volver al Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
