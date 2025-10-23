import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import InputField from '../UI/InputField.jsx';
import { alertError, alertSuccess } from '../../utils/alerts.js';


export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Si ya está autenticado, llevar al dashboard
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Prefill email si llega desde registro
    if (location.state && location.state.emailPrefill) {
      setEmail(location.state.emailPrefill);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alertError('Datos incompletos', 'Ingresa email y contraseña.');
      return;
    }
    try {
      setLoading(true);
      const { user } = await login(email, password);
      await alertSuccess('Bienvenido', user?.name || 'Ingreso exitoso');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || 'No se pudo iniciar sesión';
      alertError('Error de autenticación', msg);
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
                <h3 className="card-title m-0">Iniciar sesión</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="admin@local"
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
                      placeholder="•••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      groupClass="form-group col-12"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Ingresando...' : 'Entrar'}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    ¿Olvidaste tu contraseña? <Link to="/">Ir al inicio</Link>
                  </small>
                </div>
                <div className="mt-2 text-center">
                  <small className="text-muted">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
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
