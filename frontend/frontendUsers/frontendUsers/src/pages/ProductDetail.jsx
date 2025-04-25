import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../css/productDetail.css'; // Archivo CSS separado

export default function ProductDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/')}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  const handleQuantityChange = (value) => {
    const newValue = quantity + value;
    if (newValue >= 1 && newValue <= 10) {
      setQuantity(newValue);
    }
  };

  const handleAddToCart = () => {
    alert(`Añadido ${quantity} ${product.title} al carrito`);
  };

  return (
    <div className="product-detail-container">
      {/* Barra de navegación */}
      <div className="product-navbar">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="icon" />
          Volver
        </button>
      </div>
      
      {/* Contenido principal */}
      <div className="product-content">
        {/* Sección de imagen */}
        <div className="product-image-section">
          <div className="main-image-container">
            <img 
              src={product.image || "/api/placeholder/800/600"} 
              alt={product.title}
            />
            {product.promo && (
              <div className="promo-badge">
                PROMOCIÓN
              </div>
            )}
          </div>
          
          {/* Miniaturas */}
          <div className="thumbnails-container">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="thumbnail">
                <img 
                  src={product.image || "/api/placeholder/200/200"} 
                  alt={`${product.title} thumbnail`}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Sección de información */}
        <div className="product-info-section">
          {product.category && (
            <div className="product-category">
              {product.category}
            </div>
          )}
          
          <h1 className="product-title">{product.title}</h1>
          
          <p className="product-description">
            {product.longDescription || product.description}
          </p>
          
          {/* Rating */}
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{product.rating || 'Nuevo'}</span>
          </div>
          
          {/* Precio y controles */}
          <div className="price-controls-container">
            <div className="product-price">
              ${product.price}
              <span className="price-unit">/{product.unit || 'unidad'}</span>
            </div>
            
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)}>
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>
                +
              </button>
            </div>
          </div>
          
          {/* Botón de añadir al carrito */}
          <div className="add-to-cart-container">
            <button onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>
          
          {/* Mensaje de stock */}
          <div className="stock-message">
            Almost sold out
          </div>
        </div>
      </div>
    </div>
  );
}