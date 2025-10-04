import React from 'react';

const StatsCard = ({ title, value, change, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className={`stat-change ${change.includes('-') ? 'negative' : ''}`}>
        {change}
      </div>
    </div>
  );
};

export default StatsCard;