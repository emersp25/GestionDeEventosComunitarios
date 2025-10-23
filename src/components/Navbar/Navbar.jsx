import '../../style/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleToggleSidebar = (e) => {
    e.preventDefault();
    // React-controlled pushmenu: toggle AdminLTE's sidebar collapse class
    document.body.classList.toggle('sidebar-collapse');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    try {
      logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            role="button"
            aria-label="Toggle sidebar"
            onClick={handleToggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">Inicio</Link>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item d-none d-sm-inline-block">
          <a href="https://adminlte.io/" target="_blank" rel="noreferrer" className="nav-link">Ayuda</a>
        </li>

        {!isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                <i className="fas fa-sign-in-alt mr-1"></i>
                Iniciar sesión
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                <i className="fas fa-user-plus mr-1"></i>
                Registrarse
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item d-none d-md-flex align-items-center mr-2">
              <span className="nav-link m-0">
                <i className="fas fa-user-circle mr-1"></i>
                {user?.name || user?.email || 'Usuario'} <span className="badge badge-primary ml-1">{user?.role}</span>
              </span>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-1"></i>
                Cerrar sesión
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
