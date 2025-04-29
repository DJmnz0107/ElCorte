import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-[25px] shadow-[7px_35px_51px_rgba(0,0,0,0.14)] overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Card, CardContent };