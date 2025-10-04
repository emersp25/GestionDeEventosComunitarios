// src/components/Notifications/RecentNotifications.jsx
import React from 'react';

const RecentNotifications = ({ notifications }) => {
  return (
    <div className="notification-card">
      <div className="notification-title">
        <span>🔔</span> Notificaciones Recientes
      </div>
      <ul className="notification-list">
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentNotifications;