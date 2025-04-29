// CreditCard.jsx
import React from 'react';
import '../css/creditcard.css';

const CreditCard = ({ cardNumber, cardHolder, expiryDate }) => {
  // Format card number for display
  const displayNumber = cardNumber || '1234 1234 1234 1234';
  // Format expiry date for display
  const displayExpiry = expiryDate || '01/23';
  // Format card holder for display
  const displayHolder = cardHolder || 'Daniel Wilfredo';

  return (
    <div className="credit-card">
      <div className="card-content">
        <div className="card-chip-row">
          <div className="card-title">Credit</div>
          <div className="card-brand">
            <div className="mastercard-logo">
              <div className="circle red"></div>
              <div className="circle yellow"></div>
            </div>
          </div>
        </div>
        <div className="card-number">{displayNumber}</div>
        <div className="card-details">
          <div className="card-holder">{displayHolder}</div>
          <div className="card-expiry">{displayExpiry}</div>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;