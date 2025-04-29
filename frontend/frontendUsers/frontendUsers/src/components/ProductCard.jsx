import React from 'react';
import '../css/productCard.css'; // Archivo CSS para estilos

const ProductCard = ({ product, onClick }) => {
  return (
    <div 
      className={`product-card ${product.promo ? 'promo' : ''}`}
      onClick={onClick}
    >
      {product.promo && <div className="promo-badge">PROMO</div>}
      <img 
        src={product.image} 
        alt={product.title} 
        className="product-image"
      />
      <div className="product-category">{product.category}</div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-price">${product.price}</div>
      <div className="product-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}>★</span>
        ))}
      </div>
      <div className="sold-out">Almost sold out</div>
    </div>
  );
};

export default ProductCard;