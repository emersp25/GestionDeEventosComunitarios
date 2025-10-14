import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EventRegistrationPage from './pages/EventRegistrationpage';
import './styles/global.css'; // estilos
import EventCalendarPage from './pages/EventCalendarPage';
import InscriptionsPage from './pages/InscriptionsPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/register-event" element={<EventRegistrationPage />} />
        <Route path="/calendar-event" element={<EventCalendarPage/>} />
        <Route path="/inscription-event" element={<InscriptionsPage/>} />
        <Route path="/budgets-event" element={<BudgetsPage/>} />
        <Route path="/reports-event" element={<ReportsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
