import React from 'react';
import '../css/productCard.css'; // Archivo CSS para estilos

const ProductCard = ({ product }) => {
  return (
    <div className={`product-card ${product.promo ? 'promo' : ''}`}>
    {product.promo && <div className="promo-badge">Promoción</div>}
    <img src={`/images/${product.id}.jpg`} alt={product.title} className="product-image" />
    <div className="product-category">{product.category}</div>
    <h3 className="product-title">{product.title}</h3>
    <p className="product-description">{product.description}</p>
    <div className="product-price">${product.price}</div>
    <div className="product-rating">★★★★★</div>
    {product.promo && <div className="sold-out">Almost Sold Out</div>}
  </div>
  
  );
};

export default ProductCard;