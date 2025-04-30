import React, { useState } from 'react';
import '../css/paymentForm.css';
import SuccessAlert from '../components/SucessAlert';

const PaymentForm = ({ formData, handleChange }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular una pequeña espera antes de mostrar la alerta
    setTimeout(() => {
      setIsSubmitting(false);
      setShowAlert(true);
    }, 800);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="payment-form">
      <div className="payment-option">
        <button className="paypal-button">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
            alt="PayPal"
            className="paypal-icon"
          />
          <span>Pagar con PayPal</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="nombre@correo.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Detalles de la carta</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 1234 1234 1234"
            maxLength="19"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="expiryDate">MM/YY</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>
          <div className="form-group half">
            <label htmlFor="cvv">CCV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="cardHolder">Dueño de la tarjeta</label>
          <input
            type="text"
            id="cardHolder"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="Nombre del titular"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando...' : 'Guardar método'}
        </button>
      </form>

      <SuccessAlert show={showAlert} onClose={handleCloseAlert} />
    </div>
  );
};

export default PaymentForm;