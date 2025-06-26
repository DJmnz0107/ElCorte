import React, { useState } from 'react';
import '../css/paymentForm.css';
import SuccessAlert from '../components/SucessAlert';

const PaymentForm = ({ formData, handleChange, onSubmit, loading }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    } else {
      // Comportamiento por defecto si no se pasa onSubmit
      setTimeout(() => {
        setShowAlert(true);
      }, 800);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="payment-form">
      <div className="payment-option">
        <button className="paypal-button" type="button">
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
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="nombre@correo.com"
            required
          />
        </div>
        
        {/* Sección de Dirección de Envío */}
        <div className="address-section">
          <h3 className="section-title">Dirección de Envío</h3>
          
          <div className="form-group">
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Calle, número, colonia, ciudad"
              required
            />
          </div>
        </div>
        
        {/* Sección de Información de Pago */}
        <div className="payment-section">
          <h3 className="section-title">Información de Pago</h3>
          
          <div className="form-group">
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber || ''}
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
                value={formData.expiryDate || ''}
                onChange={handleChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div className="form-group half">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv || ''}
                onChange={handleChange}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cardHolder">Titular de la Tarjeta</label>
            <input
              type="text"
              id="cardHolder"
              name="cardHolder"
              value={formData.cardHolder || ''}
              onChange={handleChange}
              placeholder="Nombre del titular"
              required
            />
          </div>
        </div>
        
        <button 
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Confirmar Pago'}
        </button>
      </form>

      <SuccessAlert show={showAlert} onClose={handleCloseAlert} />
    </div>
  );
};

export default PaymentForm;