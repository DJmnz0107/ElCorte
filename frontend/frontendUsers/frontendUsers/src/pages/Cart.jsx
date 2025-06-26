import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authenticacionContext';
import useOrders from '../components/hooks/useDataCart';
import '../css/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Estado local que será la fuente de verdad
  const [localOrders, setLocalOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Obtén solo las funciones del hook, no el estado
  const { getOrders, addOrder, updateOrder, deleteOrder, loading, error } = useOrders();

  // Cargar las órdenes SOLO al montar el componente
  useEffect(() => {
    const loadInitialOrders = async () => {
      if (isAuthenticated && user?.id) {
        try {
          setInitialLoading(true);
          console.log('Cargando órdenes iniciales para usuario:', user.id);
          
          // Llamar getOrders con el ID del usuario
          const data = await getOrders(user.id);
          console.log('Órdenes cargadas:', data);
          setLocalOrders(data || []);
          
          if (data && data.length > 0) {
            console.log('Estructura de la primera orden:', data[0]);
            console.log('customersID de la primera orden:', data[0].customersID);
          }
        } catch (err) {
          console.error('Error loading initial orders:', err);
          setLocalOrders([]); // Asegurar que sea un array vacío en caso de error
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
        setLocalOrders([]);
      }
    };

    loadInitialOrders();
  }, [isAuthenticated, user?.id]); // Removemos getOrders del array de dependencias

  // Filtra las órdenes del usuario logueado Y que tengan status "Pending"
  const userOrders = Array.isArray(localOrders) ? localOrders.filter(order => {
    // Múltiples formas de verificar el ID del cliente
    const customerID = order.customersID?._id || order.customersID || order.customerId;
    const userID = user?.id || user?._id;
    const isUserOrder = customerID === userID;
    
    // Verificar que el status sea "Pending" (solo órdenes pendientes)
    const isPending = order.status === 'Pending';
    
    const shouldShow = isUserOrder && isPending;
    
    console.log(`Orden ${order._id}: customerID=${customerID}, userID=${userID}, status=${order.status}, isUserOrder=${isUserOrder}, isPending=${isPending}, shouldShow=${shouldShow}`);
    
    return shouldShow;
  }) : [];
  
  console.log('Todas las órdenes locales:', localOrders);
  console.log('ID del usuario actual:', user?.id);
  console.log('Órdenes del usuario (solo Pending):', userOrders);

  // Función para actualizar cantidad localmente
  const updateQuantityLocally = (orderId, productIndex, newQuantity) => {
    setLocalOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order._id === orderId) {
          const updatedProducts = [...order.products];
          if (updatedProducts[productIndex]) {
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              amount: newQuantity,
              subTotal: (updatedProducts[productIndex].productID?.price || 0) * newQuantity
            };
          }
          return { ...order, products: updatedProducts };
        }
        return order;
      });
    });
  };

  // Función para actualizar cantidad - COMPLETAMENTE LOCAL
  const updateQuantity = async (orderId, productIndex, newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;
    
    // Actualizar inmediatamente en el estado local
    updateQuantityLocally(orderId, productIndex, newQuantity);
    
    // Operación en segundo plano sin afectar la UI
    setTimeout(async () => {
      try {
        console.log('Actualizando en servidor en segundo plano...');
        
        const orderToUpdate = localOrders.find(order => order._id === orderId);
        if (!orderToUpdate) {
          console.error('Orden no encontrada:', orderId);
          return;
        }

        const updatedProducts = [...orderToUpdate.products];
        if (updatedProducts[productIndex]) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            amount: newQuantity,
            subTotal: (updatedProducts[productIndex].productID?.price || 0) * newQuantity
          };

          const updatedOrderData = {
            customersID: orderToUpdate.customersID._id || orderToUpdate.customersID,
            products: updatedProducts,
            status: orderToUpdate.status || 'Pending'
          };

          await updateOrder(orderId, updatedOrderData);
          console.log('Cantidad actualizada en servidor exitosamente');
        }
        
      } catch (err) {
        console.error('Error updating quantity in background:', err);
        // En caso de error, recargar desde servidor
        try {
          const freshOrders = await getOrders(user.id);
          setLocalOrders(freshOrders || []);
        } catch (reloadErr) {
          console.error('Error reloading orders:', reloadErr);
        }
      }
    }, 100); // Muy poco delay para que sea imperceptible
  };

  // Función para remover un producto específico de una orden
  const removeProductFromOrder = async (orderId, productIndex) => {
    if (isUpdating) return;
    
    const orderToUpdate = localOrders.find(order => order._id === orderId);
    if (!orderToUpdate) return;

    // Si solo hay un producto, eliminar toda la orden
    if (orderToUpdate.products.length === 1) {
      // Remover de estado local inmediatamente
      setLocalOrders(prev => prev.filter(order => order._id !== orderId));
      
      // Eliminar del servidor en segundo plano
      setTimeout(async () => {
        try {
          await deleteOrder(orderId);
          console.log('Orden eliminada del servidor');
        } catch (err) {
          console.error('Error removing order from server:', err);
          // Recargar en caso de error
          try {
            const freshOrders = await getOrders(user.id);
            setLocalOrders(freshOrders || []);
          } catch (reloadErr) {
            console.error('Error reloading orders:', reloadErr);
          }
        }
      }, 100);
      return;
    }

    // Si hay múltiples productos, remover solo el producto específico del estado local
    setLocalOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order._id === orderId) {
          const updatedProducts = order.products.filter((_, index) => index !== productIndex);
          return { ...order, products: updatedProducts };
        }
        return order;
      });
    });

    // Actualizar en el servidor en segundo plano
    setTimeout(async () => {
      try {
        const updatedProducts = orderToUpdate.products.filter((_, index) => index !== productIndex);
        
        const updatedOrderData = {
          customersID: orderToUpdate.customersID._id || orderToUpdate.customersID,
          products: updatedProducts,
          status: orderToUpdate.status || 'Pending'
        };

        await updateOrder(orderId, updatedOrderData);
        console.log('Producto removido del servidor exitosamente');
        
      } catch (err) {
        console.error('Error removing product from server:', err);
        // Recargar en caso de error
        try {
          const freshOrders = await getOrders(user.id);
          setLocalOrders(freshOrders || []);
        } catch (reloadErr) {
          console.error('Error reloading orders:', reloadErr);
        }
      }
    }, 100);
  };

  // Función para remover toda una orden
  const removeItem = async (orderId) => {
    // Remover de estado local inmediatamente
    setLocalOrders(prev => prev.filter(order => order._id !== orderId));
    
    // Eliminar del servidor en segundo plano
    setTimeout(async () => {
      try {
        await deleteOrder(orderId);
        console.log('Orden eliminada del servidor');
      } catch (err) {
        console.error('Error removing item from server:', err);
        // Recargar en caso de error
        try {
          const freshOrders = await getOrders(user.id);
          setLocalOrders(freshOrders || []);
        } catch (reloadErr) {
          console.error('Error reloading orders:', reloadErr);
        }
      }
    }, 100);
  };

  const calculateTotal = () => {
    if (!Array.isArray(userOrders)) return '0.00';
    
    return userOrders.reduce((total, order) => {
      if (!order.products || !Array.isArray(order.products)) return total;
      
      return total + order.products.reduce((orderTotal, product) => {
        const productPrice = product.productID?.price || 0;
        const productAmount = product?.amount || 0;
        return orderTotal + (productPrice * productAmount);
      }, 0);
    }, 0).toFixed(2);
  };

  // Función handleCheckout - navegar con orden existente
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Verificar que hay items en el carrito
    if (userOrders.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    try {
      setIsUpdating(true);
      
      // Validar que el usuario existe
      if (!user || !user.id) {
        throw new Error('Usuario no válido. Por favor inicia sesión nuevamente.');
      }

      // Tomar la primera orden existente del carrito
      const orderToUse = userOrders[0];
      
      if (!orderToUse || !orderToUse._id) {
        throw new Error('No hay órdenes válidas en el carrito');
      }

      // Calcular el total de esta orden específica
      const orderTotal = orderToUse.products.reduce((total, product) => {
        const productPrice = product.productID?.price || 0;
        const productAmount = product?.amount || 0;
        return total + (productPrice * productAmount);
      }, 0);

      console.log('Usando orden existente:', orderToUse._id);
      console.log('Estructura completa de la orden:', orderToUse);
      console.log('Total calculado:', orderTotal);
      console.log('Navegando con orderId:', orderToUse._id);

      // Navegar a confirm-payment pasando el ID de la orden existente
      navigate('/confirm-payment', {
        state: {
          orderId: orderToUse._id,
          // También pasar la orden completa como backup
          orderData: orderToUse,
          // Y el total calculado
          total: orderTotal
        }
      });

      // Limpiar el estado local para feedback visual
      setLocalOrders([]);

    } catch (err) {
      console.error('Error durante checkout:', err);
      
      let errorMessage = 'Error desconocido al procesar el checkout';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      alert(`Error al procesar el checkout: ${errorMessage}. Por favor intenta de nuevo.`);
      setIsUpdating(false);
    }
  };

  // Debug: Mostrar información de estado
  console.log('=== DEBUG CART STATE ===');
  console.log('initialLoading:', initialLoading);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('localOrders:', localOrders);
  console.log('userOrders:', userOrders);
  console.log('userOrders.length:', userOrders.length);
  console.log('========================');

  if (initialLoading) {
    return <div className="cart-page">Cargando carrito...</div>;
  }

  if (error && localOrders.length === 0) {
    return <div className="cart-page">Error: {error}</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Tu Carrito de Compras</h1>
        
        {userOrders.length === 0 && !isUpdating ? (
          <div className="empty-cart">
            <h2>Tu carrito está vacío</h2>
            <p>Parece que no has agregado ningún producto todavía o no tienes órdenes pendientes. Si no es así, revisa si has iniciado sesión.</p>
            <Link to="/tienda" className="browse-products-btn">
              Explorar Productos
            </Link>
          </div>
        ) : userOrders.length === 0 && isUpdating ? (
          <div className="empty-cart">
            <h2>Procesando tu pedido...</h2>
            <p>Redirigiendo a la confirmación de pedido.</p>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-container">
              {userOrders.map(order => 
                order.products && Array.isArray(order.products) ? order.products.map((product, index) => {
                  const productInfo = product.productID || {};
                  const productName = productInfo.productName || productInfo.title || 'Producto no disponible';
                  const productPrice = productInfo.price || 0;
                  const productImage = productInfo.image || '/placeholder-product.png';
                  const productCategory = productInfo.categoriesID?.categoryName || productInfo.category || 'Categoría no disponible';
                  const productDescription = productInfo.productDescription || productInfo.description || 'Descripción no disponible';
                  
                  console.log('Product full info:', {
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    category: productCategory,
                    description: productDescription,
                    fullProduct: productInfo
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
                              onClick={() => updateQuantity(order._id, index, (product?.amount || 1) - 1)}
                              className="quantity-btn"
                              disabled={(product?.amount || 1) <= 1}
                            >
                              -
                            </button>
                            <span className="quantity-value">{product?.amount || 0}</span>
                            <button 
                              onClick={() => updateQuantity(order._id, index, (product?.amount || 1) + 1)}
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
                        onClick={() => removeProductFromOrder(order._id, index)}
                        className="remove-item-btn"
                        title="Remover este producto"
                      >
                        ×
                      </button>
                    </div>
                  );
                }) : []
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
                disabled={!isAuthenticated || userOrders.length === 0 || isUpdating}
              >
                {isUpdating ? 'Procesando...' : 'Proceder al Pago'}
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