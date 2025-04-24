import React from 'react';
import '../css/promoHeader.css';
import forkImage from '../assets/tenedorCarne.png';

const PromoHeader = () => {
  return (
    <section className="promo-header-container">
    <div className="promo-image-container">
      <img src={forkImage} alt="Tenedor con carne" className="fork-image" />
    </div>
    <div className="promo-text-container">
      <span className="promo-label">Trato del mes</span>
      <h1 className="promo-main-title">
        Compra 1/2 Libra de lomo de cerdo y obten un kit de tenedores.
      </h1>
      <p className="promo-subtitle">
        Llévate un jugoso lomo de cerdo junto con un kit de tenedores gourmet para realzar su sabor.
      </p>
      <p className="promo-description">
        ¡Perfecto para una parrillada inolvidable!
      </p>
    </div>
  </section>
  
  );
};

export default PromoHeader;
