import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EventRegistrationPage from './pages/EventRegistrationpage';
import './styles/global.css'; // Asegúrate de importar los estilos
import EventCalendarPage from './pages/EventCalendarPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/register-event" element={<EventRegistrationPage />} />
        <Route path="/calendar-event" element={<EventCalendarPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
