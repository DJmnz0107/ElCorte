// components/Dashboard/BarChart.jsx
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const BarChart = ({ title, data, period }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bar-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-period">
          <span>{period}</span>
          <MdKeyboardArrowDown className="period-icon" />
        </div>
      </div>
      
      <div className="bar-chart">
        <div className="bar-chart-container">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 100;
            return (
              <div key={index} className="bar-item">
                <div className="bar-column">
                  <div 
                    className="bar-fill"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <div className="bar-label">name</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarChart;