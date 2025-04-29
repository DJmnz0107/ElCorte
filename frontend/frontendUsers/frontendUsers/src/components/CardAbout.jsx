
import React from 'react';
import './CardAbout.css';

const CardAbout = ({ title, description }) => {
  return (
    <div className="card-about">
      <h3 className="card-about-title">{title}</h3>
      <p className="card-about-description">{description}</p>
    </div>
  );
};

export default CardAbout;