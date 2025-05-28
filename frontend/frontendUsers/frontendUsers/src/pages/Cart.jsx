import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/cart.css';

// URL de la imagen de carne
const meatImageUrl = "https://png.pngtree.com/png-clipart/20230927/original/pngtree-the-butcher-s-cut-guide-of-pork-png-image_13140626.png";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      category: "Carnes",
      title: "Lomo de Cerdo Premium",
      description: "1/2 Libra de corte selecto",
      price: "95.50",
      promo: true,
      quantity: 2,
      image: meatImageUrl
    },
    {
      id: 2,
      category: "Accesorios",
      title: "Kit de Tenedores Gourmet",
      description: "Set de 4 tenedores profesionales",
      price: "35.99",
      quantity: 1,
      image: meatImageUrl
    },
    {
      id: 4,
      category: "Paquetes",
      title: "Parrillada Familiar",
      description: "Variedad de carnes para 6 personas",
      price: "299.00",
      quantity: 1,
      image: meatImageUrl
    },
    {
      id: 5,
      category: "Carnes",
      title: "Lomo de Cerdo Premium",
      description: "1/2 Libra de corte selecto",
      price: "95.50",
      promo: true,
      quantity: 2,
      image: meatImageUrl
    },
    {
      id: 6,
      category: "Accesorios",
      title: "Kit de Tenedores Gourmet",
      description: "Set de 4 tenedores profesionales",
      price: "35.99",
      quantity: 1,
      image: meatImageUrl
    },
    {
      id: 7,
      category: "Paquetes",
      title: "Parrillada Familiar",
      description: "Variedad de carnes para 6 personas",
      price: "299.00",
      quantity: 1,
      image: meatImageUrl
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? {...item, quantity: newQuantity} : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/confirm-payment');
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Tu Carrito de Compras</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>
            <p>Parece que no has agregado ningún producto todavía.</p>
            <Link to="/productos" className="browse-products-btn">
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-container">
              {cartItems.map(item => (
                <div key={item.id} className={`cart-item-card ${item.promo ? 'promo' : ''}`}>
                  {item.promo && <div className="promo-badge">PROMO</div>}
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} className="product-image" />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <span className="cart-item-category">{item.category}</span>
                      <h3 className="cart-item-title">{item.title}</h3>
                    </div>
                    <p className="cart-item-description">{item.description}</p>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-price">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-details">
                <h3>Resumen del Pedido</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="checkout-btn"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;