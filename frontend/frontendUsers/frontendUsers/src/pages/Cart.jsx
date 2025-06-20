import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authenticacionContext';
import useOrders from '../components/hooks/useDataCart';
import '../css/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Obtén los datos del hook useOrders
  const { orders, getOrders, addOrder, deleteOrder, loading, error } = useOrders();

  // Cargar las órdenes (carrito) al montar el componente
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('Cargando órdenes para usuario:', user.id); // Debug
      getOrders()
        .then((data) => {
          console.log('Órdenes cargadas:', data); // Debug
          // Debug adicional para ver la estructura
          if (data.length > 0) {
            console.log('Estructura de la primera orden:', data[0]);
            console.log('customersID de la primera orden:', data[0].customersID);
          }
        })
        .catch((err) => {
          console.error('Error loading orders:', err);
        });
    }
  }, [isAuthenticated, user?.id, getOrders]);

  // Filtra las órdenes del usuario logueado
  // Como customersID es un objeto, necesitamos comparar con su _id
  const userOrders = orders.filter(order => {
    const customerID = order.customersID?._id || order.customersID;
    const match = customerID === user?.id;
    
    // Debug para cada orden
    console.log(`Orden ${order._id}: customerID=${customerID}, userID=${user?.id}, match=${match}`);
    
    return match;
  });
  
  console.log('Todas las órdenes:', orders); // Debug
  console.log('ID del usuario actual:', user?.id); // Debug
  console.log('Órdenes del usuario:', userOrders); // Debug

  // Función para actualizar cantidad
  const updateQuantity = async (orderId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // Buscar la orden específica
      const orderToUpdate = userOrders.find(order => order._id === orderId);
      if (!orderToUpdate) return;

      // Crear una nueva orden con la cantidad actualizada
      const updatedProducts = orderToUpdate.products.map(product => ({
        ...product,
        amount: newQuantity
      }));

      const updatedOrderData = {
        ...orderToUpdate,
        products: updatedProducts
      };

      // Aquí necesitarías una función updateOrder en tu hook
      // Por ahora, elimina la orden antigua y crea una nueva
      await deleteOrder(orderId);
      await addOrder(updatedOrderData);
      
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const calculateTotal = () => {
    return userOrders.reduce((total, order) => {
      return total + order.products.reduce((orderTotal, product) => {
        // Usar el precio del producto poblado o el subTotal si está disponible
        const productPrice = product.productID?.price || 0;
        const productAmount = product?.amount || 0;
        return orderTotal + (productPrice * productAmount);
      }, 0);
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    try {
      // Crear una orden de checkout con todos los items del carrito
      const checkoutItems = userOrders.flatMap(order => 
        order.products.map(product => ({
          productID: product.productID,
          amount: product.amount,
          subTotal: (product.price || 0) * (product.amount || 0)
        }))
      );

      const response = await addOrder({
        customersID: user.id,
        products: checkoutItems,
        status: 'pending' // o el estado que uses para órdenes pendientes
      });

      // Vaciar el carrito después de crear la orden
      for (const order of userOrders) {
        await deleteOrder(order._id);
      }

      navigate(`/order-confirmation/${response._id}`);
    } catch (err) {
      console.error('Error during checkout:', err);
    }
  };

  if (loading) {
    return <div className="cart-page">Cargando carrito...</div>;
  }

  if (error) {
    return <div className="cart-page">Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Tu Carrito de Compras</h1>
        
        {userOrders.length === 0 ? (
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
              {userOrders.map(order => 
  order.products.map((product, index) => {
    const productInfo = product.productID || {};
    const productName = productInfo.productName || 'Producto no disponible';
    const productPrice = productInfo.price || 0;
    const productImage = productInfo.image || '/placeholder-product.png';
    const productCategory = productInfo.categoriesID?.categoryName || 'Categoría no disponible';
    const productDescription = productInfo.productDescription || 'Descripción no disponible';
    console.log('Product full info:', {
      name: productInfo.productName,
      price: productInfo.price,
      image: productInfo.image,
      category: productInfo.categoriesID?.categoryName,
      description: productInfo.description, // Verifica esto específicamente
      hasDescription: 'description' in productInfo // Esto te dirá si el campo existe
    });
                  
                  return (
                    <div key={`${order._id}-${index}`} className="cart-item-card">
                      <div className="cart-item-image">
                        <img 
                          src={productImage}
                          alt={productName}
                          className="product-image"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <span className="cart-item-category">{productCategory}</span>
                          <h3 className="cart-item-title">{productName}</h3>
                        </div>
                        <p className="cart-item-description">{productDescription}</p>
                        <div className="cart-item-controls">
                          <div className="quantity-control">
                            <button 
                              onClick={() => updateQuantity(order._id, (product?.amount || 1) - 1)}
                              className="quantity-btn"
                              disabled={(product?.amount || 1) <= 1}
                            >
                              -
                            </button>
                            <span className="quantity-value">{product?.amount || 0}</span>
                            <button 
                              onClick={() => updateQuantity(order._id, (product?.amount || 1) + 1)}
                              className="quantity-btn"
                            >
                              +
                            </button>
                          </div>
                          <div className="cart-item-price">
                            ${(productPrice * (product?.amount || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(order._id)}
                        className="remove-item-btn"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
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
                disabled={!isAuthenticated || userOrders.length === 0}
              >
                Proceder al Pago
              </button>
              {!isAuthenticated && (
                <p className="login-message">Debes iniciar sesión para finalizar la compra</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;