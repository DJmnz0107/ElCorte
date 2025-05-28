// components/Dashboard/StatsCard.jsx
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const StatsCard = ({ title, value, subtitle, period, children }) => {
  return (
    <div className="stats-card">
      <div className="stats-header">
        <h3 className="stats-title">{title}</h3>
        <div className="stats-period">
          <span>{period}</span>
          <MdKeyboardArrowDown className="period-icon" />
        </div>
      </div>
      
      <div className="stats-value">{value}</div>
      <div className="stats-subtitle">{subtitle}</div>
      
      {children && (
        <div className="stats-chart">
          {children}
        </div>
      )}
    </div>
  );
};

export default StatsCard;