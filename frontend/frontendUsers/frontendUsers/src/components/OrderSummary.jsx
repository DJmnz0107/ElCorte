// OrderSummary.jsx
import React from 'react';
import '../css/orderSummary.css';

const OrderSummary = ({ items, total }) => {
  return (
    <div className="order-summary">
      <h2 className="order-title">Total de pago</h2>
      <p className="order-total">{total} US$</p>
      
      <div className="order-dropdown">
        <button className="items-count-button">
          {items.length} Artículos
          <svg 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            className="dropdown-icon"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      <div className="items-card">
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="item-info">
              <img 
                src={item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947'} 
                alt={item.name}
                className="item-image"
              />
              <span className="item-name">{item.name}</span>
            </div>
            <div className="item-quantity">{item.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSummary;