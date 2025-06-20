import React, { useState, useContext, useEffect } from 'react'; // Añadido useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useOrders from '../components/hooks/useDataCart';
import { useAuth } from '../context/authenticacionContext';
import '../css/productDetail.css';

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const { addOrder, loading: orderLoading, error: orderError } = useOrders();
  const { user, isAuthenticated } = useAuth();

  // Debug useEffect - ahora correctamente colocado dentro del componente
  useEffect(() => {
    console.log('Producto actual:', product);
    console.log('Usuario autenticado:', isAuthenticated, user);
  }, [product, isAuthenticated, user]);

  // Verificación más robusta del producto
  if (!product || !product._id) {
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

  const handleAddToCart = async () => {
    console.log('Usuario actual:', user);
    
    if (!isAuthenticated || !(user?.id || user?._id)) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const orderData = {
        customersID: user.id || user._id,
        products: [{
          productID: product._id,
          amount: quantity,
          subTotal: product.price * quantity
        }],
        total: product.price * quantity,
        status: "Pending"
      };

      console.log('Datos de la orden:', orderData);
      const newOrder = await addOrder(orderData);
      alert(`¡Orden creada! #${newOrder._id || newOrder.id}`);
    } catch (err) {
      console.error('Error:', err);
      alert(`Error: ${err.message || 'No se pudo crear la orden'}`);
    }
  };

  const getImageSrc = (img) => {
    return img && img.trim() !== '' ? img : '/placeholder-product.png';
  };

  return (
    <div className="product-detail-container">
      <div className="product-navbar">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="icon" />
          Volver
        </button>
      </div>
      
      <div className="product-content">
        <div className="product-image-section">
          <div className="main-image-container">
            <img 
              src={getImageSrc(product.image)}
              alt={product.title}
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
                e.target.onerror = null;
              }}
            />
            {product.promo && <div className="promo-badge">PROMOCIÓN</div>}
          </div>
          
          <div className="thumbnails-container">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="thumbnail">
                <img 
                  src={getImageSrc(product.image)}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                    e.target.onerror = null;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
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
          
          <div className="price-controls-container">
            <div className="product-price">
              ${product.price}
              <span className="price-unit">/{product.unit || 'unidad'}</span>
            </div>
            
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)} disabled={orderLoading}>
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={orderLoading}>
                +
              </button>
            </div>
          </div>
          
          <div className="add-to-cart-container">
            <button 
              onClick={handleAddToCart}
              disabled={orderLoading}
            >
              {orderLoading ? 'Procesando...' : 'Agregar al carrito'}
            </button>
            {orderError && <div className="error-message">{orderError}</div>}
          </div>
          
          <div className="stock-message">
            Almost sold out
          </div>
        </div>
      </div>
    </div>
  );
}