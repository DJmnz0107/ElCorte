// components/Dashboard/CategoryChart.jsx
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const CategoryChart = ({ title, data, period }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="category-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-period">
          <span>{period}</span>
          <MdKeyboardArrowDown className="period-icon" />
        </div>
      </div>
      
      <div className="category-bars">
        {data.map((item, index) => {
          const width = (item.value / maxValue) * 100;
          return (
            <div key={index} className="category-bar-container">
              <div className="category-info">
                <span className="category-name">{item.name}</span>
              </div>
              <div className="category-bar-track">
                <div 
                  className="category-bar-fill"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: item.color 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;