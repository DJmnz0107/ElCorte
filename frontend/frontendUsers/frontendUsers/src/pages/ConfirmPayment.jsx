// ConfirmPayment.jsx
import React, { useState } from 'react';
import CreditCard from '../components/CreditCard';
import OrderSummary from '../components/OrderSummary';
import PaymentForm from '../components/PaymentForm';
import '../css/confirmPayment.css';

const ConfirmPayment = () => {
  const orderItems = [
    {
      name: 'Picaña',
      quantity: 4,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947'
    }
  ];

  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s+/g, '');
      let formatted = '';
      for (let i = 0; i < cleaned.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += cleaned[i];
      }
      setFormData({ ...formData, [name]: formatted });
    } else if (name === 'expiryDate') {
      const cleaned = value.replace(/[^\d]/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="grid-layout">
          {/* Columna izquierda - Resumen de orden */}
          <div className="left-column">
            <OrderSummary
              items={orderItems}
              total="40.00"
            />
          </div>

          {/* Columna derecha - Tarjeta y formulario */}
          <div className="right-column">
            <div className="credit-card-container">
              <CreditCard
                cardNumber={formData.cardNumber}
                cardHolder={formData.cardHolder}
                expiryDate={formData.expiryDate}
              />
            </div>

            <PaymentForm
              formData={formData}
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
