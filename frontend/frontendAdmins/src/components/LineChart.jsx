// components/Dashboard/LineChart.jsx
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

const LineChart = ({ title, value, subtitle, data, period }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;
  
  const width = 300;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item.value - minValue) / range) * chartHeight;
    return { x, y, value: item.value, month: item.month };
  });

  const pathData = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <div className="line-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <div className="chart-period">
          <span>{period}</span>
          <MdKeyboardArrowDown className="period-icon" />
        </div>
      </div>
      
      <div className="line-chart-stats">
        <div className="line-chart-value">{value}</div>
        <div className="line-chart-subtitle">{subtitle}</div>
      </div>
      
      <div className="line-chart">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = padding + (percent / 100) * chartHeight;
            return (
              <line
                key={percent}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Chart lines */}
          <path
            d={pathData}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          <path
            d={pathData.replace('M', 'M').concat(' L', (width - padding), ' ', (padding + chartHeight), ' L', padding, ' ', (padding + chartHeight), ' Z')}
            fill="url(#gradient1)"
            opacity="0.1"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#ef4444"
              stroke="#ffffff"
              strokeWidth="2"
            />
          ))}
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        
        <div className="chart-x-labels">
          {data.map((item, index) => (
            <span key={index} className="x-label">{item.month}</span>
          ))}
        </div>
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#ef4444' }}></div>
          <span>Content</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#06b6d4' }}></div>
          <span>Content</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: '#8b5cf6' }}></div>
          <span>Content</span>
        </div>
      </div>
    </div>
  );
};

export default LineChart;