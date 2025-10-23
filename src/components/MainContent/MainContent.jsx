import '../../style/MainContent.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard.jsx';
import EventsList from '../Events/EventsList.jsx';
import CreateEventForm from '../Events/CreateEventForm.jsx';
import RegistrationsList from '../Registrations/RegistrationsList.jsx';
import CreateRegistrationForm from '../Registrations/CreateRegistrationForm.jsx';
import Calendar from '../Calendar/Calendar.jsx';
import BudgetsList from '../Budgets/BudgetsList.jsx';
import CreateBudgetForm from '../Budgets/CreateBudgetForm.jsx';
import ProtectedRoute from '../Auth/ProtectedRoute.jsx';
import Login from '../Auth/Login.jsx';
import Register from '../Auth/Register.jsx';
import Reports from '../Reports/Reports.jsx';

function MainContent() {
  return (
    <section className="content">
      <div className="container-fluid">
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protegidas por rol: ADMIN */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/events" element={<EventsList />} />
            <Route path="/events/create" element={<CreateEventForm />} />
            <Route path="/budgets" element={<BudgetsList />} />
            <Route path="/budgets/create" element={<CreateBudgetForm />} />
          </Route>

          {/* Protegidas por rol: ADMIN y USER */}
          <Route element={<ProtectedRoute roles={['ADMIN','USER']} />}>
            <Route path="/registrations" element={<RegistrationsList />} />
            <Route path="/registrations/create" element={<CreateRegistrationForm />} />
          </Route>

          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </div>
    </section>
  );
}

export default MainContent;
