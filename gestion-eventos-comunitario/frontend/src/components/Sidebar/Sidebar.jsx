import { useEffect, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../style/Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const isEventsActive = location.pathname.startsWith("/events");
  const isRegistrationsActive = location.pathname.startsWith("/registrations");
  const isBudgetsActive = location.pathname.startsWith("/budgets");

  // Auth state
  const { isAuthenticated, hasRole } = useAuth();
  const canAdmin = isAuthenticated && hasRole(["ADMIN"]);
  const canUserOps = isAuthenticated && hasRole(["ADMIN", "USER"]); // USER y ADMIN pueden ver Inscripciones

  // Local open/close state independent of AdminLTE JS
  const [eventsOpen, setEventsOpen] = useState(isEventsActive);
  const [registrationsOpen, setRegistrationsOpen] = useState(
    isRegistrationsActive
  );
  const [budgetsOpen, setBudgetsOpen] = useState(isBudgetsActive);

  // Keep sections open if the current route is inside them
  useEffect(() => {
    setEventsOpen(isEventsActive);
    setRegistrationsOpen(isRegistrationsActive);
    setBudgetsOpen(isBudgetsActive);
  }, [isEventsActive, isRegistrationsActive, isBudgetsActive]);

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <NavLink to="/" className="brand-link">
        <span className="brand-text font-weight-light">
          Eventos Comunitarios
        </span>
      </NavLink>

      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Público */}
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/calendar"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <i className="nav-icon fas fa-calendar-alt"></i>
                <p>Calendario</p>
              </NavLink>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <i className="nav-icon fas fa-sign-in-alt"></i>
                    <p>Iniciar sesión</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <i className="nav-icon fas fa-user-plus"></i>
                    <p>Registrarse</p>
                  </Link>
                </li>
              </>
            )}

            {/* Operaciones (solo visibles para usuarios autenticados) */}
            {(canAdmin || canUserOps) && (
              <li className="nav-header">Operaciones</li>
            )}

            {/* Registrar Evento (ADMIN) */}
            {canAdmin && (
              <li
                className={`nav-item has-treeview ${
                  eventsOpen || isEventsActive ? "menu-open" : ""
                }`}
              >
                {/* Parent toggler */}
                <a
                  href="#"
                  className={`nav-link ${
                    eventsOpen || isEventsActive ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setEventsOpen((prev) => !prev);
                  }}
                  role="button"
                  aria-expanded={
                    eventsOpen || isEventsActive ? "true" : "false"
                  }
                  aria-controls="treeview-events"
                >
                  <i className="nav-icon fas fa-calendar-plus"></i>
                  <p>
                    Registrar Evento
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul
                  id="treeview-events"
                  className="nav nav-treeview"
                  style={{
                    display: eventsOpen || isEventsActive ? "block" : "none",
                  }}
                >
                  <li className="nav-item">
                    <NavLink
                      to="/events"
                      end
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-list-ul nav-icon"></i>
                      <p>Listar</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/events/create"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-plus-circle nav-icon"></i>
                      <p>Crear</p>
                      <span className="right badge badge-accent">Nuevo</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Inscripciones (USER y ADMIN) */}
            {canUserOps && (
              <li
                className={`nav-item has-treeview ${
                  registrationsOpen || isRegistrationsActive ? "menu-open" : ""
                }`}
              >
                <a
                  href="#"
                  className={`nav-link ${
                    registrationsOpen || isRegistrationsActive ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setRegistrationsOpen((prev) => !prev);
                  }}
                  role="button"
                  aria-expanded={
                    registrationsOpen || isRegistrationsActive
                      ? "true"
                      : "false"
                  }
                  aria-controls="treeview-registrations"
                >
                  <i className="nav-icon fas fa-user-check"></i>
                  <p>
                    Inscripciones
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul
                  id="treeview-registrations"
                  className="nav nav-treeview"
                  style={{
                    display:
                      registrationsOpen || isRegistrationsActive
                        ? "block"
                        : "none",
                  }}
                >
                  <li className="nav-item">
                    <NavLink
                      to="/registrations"
                      end
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-list-ul nav-icon"></i>
                      <p>Listar</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/registrations/create"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-plus-circle nav-icon"></i>
                      <p>Crear</p>
                      <span className="right badge badge-accent">Nuevo</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Presupuestos (ADMIN) */}
            {canAdmin && (
              <li
                className={`nav-item has-treeview ${
                  budgetsOpen || isBudgetsActive ? "menu-open" : ""
                }`}
              >
                <a
                  href="#"
                  className={`nav-link ${
                    budgetsOpen || isBudgetsActive ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setBudgetsOpen((prev) => !prev);
                  }}
                  role="button"
                  aria-expanded={
                    budgetsOpen || isBudgetsActive ? "true" : "false"
                  }
                  aria-controls="treeview-budgets"
                >
                  <i className="nav-icon fas fa-coins"></i>
                  <p>
                    Presupuestos
                    <i className="right fas fa-angle-left"></i>
                  </p>
                </a>
                <ul
                  id="treeview-budgets"
                  className="nav nav-treeview"
                  style={{
                    display: budgetsOpen || isBudgetsActive ? "block" : "none",
                  }}
                >
                  <li className="nav-item">
                    <NavLink
                      to="/budgets"
                      end
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-list-ul nav-icon"></i>
                      <p>Listar</p>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/budgets/create"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      <i className="fas fa-plus-circle nav-icon"></i>
                      <p>Crear</p>
                      <span className="right badge badge-accent">Nuevo</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {canAdmin && <li className="nav-header">Herramientas</li>}

            {canAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/reports"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <i className="nav-icon fas fa-chart-line"></i>
                  <p>Reports</p>
                </NavLink>
              </li>
            )}
        </ul>
      </nav>
    </div>
  </aside>
);

}

export default Sidebar;
