// ConfirmPayment.jsx
import React, { useState } from 'react';
import CreditCard from '../components/CreditCard';
import OrderSummary from '../components/OrderSummary';
import PaymentForm from '../components/PaymentForm';
import '../css/confirmPayment.css';

const ConfirmPayment = () => {
  // Datos de ejemplo para la orden
  const orderItems = [
    {
      name: 'Picaña',
      quantity: 4,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947'
    }
  ];
  
  // Estado para los datos del formulario de pago
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Manejador para los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formateo especial para el número de tarjeta (añadir espacios cada 4 dígitos)
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\s+/g, '');
      let formatted = '';
      
      for (let i = 0; i < cleaned.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formatted += ' ';
        }
        formatted += cleaned[i];
      }
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    }
    // Formateo para fecha de expiración (MM/YY)
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/[^\d]/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      
      setFormData({
        ...formData,
        [name]: formatted
      });
    }
    // Para otros campos
    else {
      setFormData({
        ...formData,
        [name]: value
      });
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
            {/* La tarjeta de crédito que muestra los datos actualizados */}
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