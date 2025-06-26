import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, User, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import useOrders from '../components/hooks/useDataCart';
import useReviews from '../components/hooks/useReviews';
import { useAuth } from '../context/authenticacionContext';
import '../css/productDetail.css';

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [toasts, setToasts] = useState([]);
  
  const { addOrder, updateOrder, getOrders, loading: orderLoading, error: orderError } = useOrders();
  const { 
    getReviewsByProduct, 
    addReview, 
    loading: reviewsLoading, 
    error: reviewsError 
  } = useReviews();
  
  const { user, isAuthenticated } = useAuth();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [productReviews, setProductReviews] = useState([]);

  // Sistema de Toast
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  // Cargar reseñas del producto (solo una vez al montar o cambiar producto)
  useEffect(() => {
    const loadProductReviews = async () => {
      if (product?._id) {
        try {
          console.log('Cargando reseñas para producto:', product._id);
          const reviews = await getReviewsByProduct(product._id);
          console.log('Reseñas cargadas:', reviews);
          setProductReviews(reviews || []);
        } catch (error) {
          console.error('Error cargando reseñas:', error);
          setProductReviews([]);
        }
      }
    };

    loadProductReviews();
  }, [product?._id]); // Solo depende del ID del producto

  // Cargar orden pendiente del usuario (solo una vez al montar o cambiar usuario)
  useEffect(() => {
    const loadPendingOrder = async () => {
      if (isAuthenticated && (user?.id || user?._id)) {
        try {
          const orders = await getOrders(user.id || user._id);
          const userPendingOrders = orders.filter(order => {
            const orderCustomerID = order.customersID?._id || order.customersID;
            const currentUserID = user?.id || user?._id;
            const isUserOrder = orderCustomerID === currentUserID;
            const isPending = order.status === "Pending";
            return isUserOrder && isPending;
          });
          
          const pendingOrder = userPendingOrders.length > 0 ? userPendingOrders[0] : null;
          setCurrentOrder(pendingOrder);
        } catch (error) {
          console.error('Error al cargar órdenes:', error);
          setCurrentOrder(null);
        }
      } else {
        setCurrentOrder(null);
      }
    };

    loadPendingOrder();
  }, [isAuthenticated, user?.id]); // Solo depende de autenticación y ID del usuario

  // Verificación del producto
  if (!product || !product._id) {
    return (
      <div className="product-detail-container">
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate('/')}>
            Volver a la tienda
          </button>
        </div>
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
    if (!isAuthenticated || !(user?.id || user?._id)) {
      showToast('Debes iniciar sesión para agregar productos al carrito', 'warning');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const newProduct = {
        productID: product._id,
        amount: quantity,
        subTotal: product.price * quantity
      };

      if (currentOrder && currentOrder.products && Array.isArray(currentOrder.products)) {
        const existingProductIndex = currentOrder.products.findIndex(
          p => {
            const pid = p.productID?._id || p.productID;
            return pid === product._id;
          }
        );

        let updatedProducts;
        if (existingProductIndex !== -1) {
          updatedProducts = [...currentOrder.products];
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            amount: updatedProducts[existingProductIndex].amount + quantity,
            subTotal: updatedProducts[existingProductIndex].subTotal + (product.price * quantity)
          };
        } else {
          updatedProducts = [...currentOrder.products, newProduct];
        }

        const newTotal = updatedProducts.reduce((sum, p) => sum + (p.subTotal || 0), 0);

        const updatedOrderData = {
          customersID: (() => {
            const cid = currentOrder.customersID;
            if (typeof cid === 'object' && cid._id) {
              return cid._id;
            }
            return cid;
          })(),
          products: updatedProducts,
          total: newTotal,
          status: "Pending"
        };

        const updatedOrder = await updateOrder(currentOrder._id || currentOrder.id, updatedOrderData);
        setCurrentOrder(updatedOrder);
        showToast(`¡Producto agregado al carrito! Total: $${newTotal.toFixed(2)}`, 'success');
      } else {
        const orderData = {
          customersID: user.id || user._id,
          products: [newProduct],
          total: product.price * quantity,
          status: "Pending"
        };

        const newOrder = await addOrder(orderData);
        setCurrentOrder(newOrder);

        try {
          const refreshedOrders = await getOrders(user.id || user._id);
          const userPendingOrders = refreshedOrders.filter(order => {
            const orderCustomerID = order.customersID?._id || order.customersID;
            const currentUserID = user?.id || user?._id;
            const isUserOrder = orderCustomerID === currentUserID;
            const isPending = order.status === "Pending";
            return isUserOrder && isPending;
          });
          
          const latestPendingOrder = userPendingOrders.length > 0 ? userPendingOrders[0] : null;
          if (latestPendingOrder) {
            setCurrentOrder(latestPendingOrder);
          }
        } catch (refreshError) {
          console.error('Error refrescando órdenes:', refreshError);
        }
        
        showToast(`¡Carrito creado! Producto agregado por $${(product.price * quantity).toFixed(2)}`, 'success');
      }

      setQuantity(1);
    } catch (err) {
      console.error('Error completo:', err);
      showToast(`Error: ${err.message || 'No se pudo agregar el producto al carrito'}`, 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast('Debes iniciar sesión para dejar una reseña', 'warning');
      return;
    }

    if (!newReview.comment.trim()) {
      showToast('Por favor escribe un comentario', 'warning');
      return;
    }

    try {
      const reviewData = {
        productID: product._id,
        customersID: user.id || user._id,
        rating: newReview.rating,
        comments: newReview.comment.trim() // Cambié 'comment' por 'comments'
      };

      console.log('Enviando reseña:', reviewData);
      const createdReview = await addReview(reviewData);
      console.log('Reseña creada:', createdReview);
      
      // Recargar las reseñas después de agregar una nueva
      const updatedReviews = await getReviewsByProduct(product._id);
      setProductReviews(updatedReviews || []);
      
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      showToast('¡Reseña agregada exitosamente!', 'success');
    } catch (error) {
      console.error('Error al agregar reseña:', error);
      showToast('Error al agregar la reseña', 'error');
    }
  };

  const getImageSrc = (img) => {
    return img && img.trim() !== '' ? img : '/placeholder-product.png';
  };

  const getCartInfo = () => {
    if (!currentOrder || !currentOrder.products || !Array.isArray(currentOrder.products)) {
      return { itemCount: 0, total: 0 };
    }
    
    const itemCount = currentOrder.products.reduce((sum, p) => sum + (p.amount || 0), 0);
    return { itemCount, total: currentOrder.total || 0 };
  };

  const cartInfo = getCartInfo();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16}
        className={`review-star ${i < rating ? 'filled' : ''}`}
        fill={i < rating ? '#f59e0b' : 'none'}
        color={i < rating ? '#f59e0b' : '#d1d5db'}
      />
    ));
  };

  const averageRating = productReviews.length > 0 
    ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
    : 0;

  // Función para obtener el nombre del usuario de la reseña
  const getReviewerName = (review) => {
    // Revisar diferentes posibles estructuras de datos
    if (review.customersID) {
      if (typeof review.customersID === 'object') {
        // Combinar firstName y lastName si están disponibles
        const firstName = review.customersID.firstName || '';
        const lastName = review.customersID.lastName || '';
        if (firstName || lastName) {
          return `${firstName} ${lastName}`.trim();
        }
        return review.customersID.name || review.customersID.username || review.customersID.email || 'Usuario';
      } else if (typeof review.customersID === 'string') {
        return review.customersID;
      }
    }
    
    // Revisar si hay otros campos de usuario
    if (review.customerName) return review.customerName;
    if (review.userName) return review.userName;
    if (review.user?.name) return review.user.name;
    
    return 'Usuario anónimo';
  };

  // Función para obtener el comentario de la reseña
  const getReviewComment = (review) => {
    // Cambié el orden para buscar 'comments' primero
    return review.comments || review.comment || review.text || review.description || 'Sin comentario';
  };

  // Función para obtener la fecha de la reseña
  const getReviewDate = (review) => {
    const date = review.createdAt || review.date || review.timestamp;
    if (!date) return 'Fecha no disponible';
    
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no válida';
    }
  };

  return (
    <div className="product-detail-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {getToastIcon(toast.type)}
            </div>
            <div className="toast-message">
              {toast.message}
            </div>
            <button 
              className="toast-close"
              onClick={() => removeToast(toast.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="product-navbar">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="icon" />
          Volver
        </button>
        
        {cartInfo.itemCount > 0 && (
          <div className="cart-info">
            Carrito: {cartInfo.itemCount} items - ${cartInfo.total.toFixed(2)}
          </div>
        )}
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
            {renderStars(Math.floor(averageRating))}
            <span className="rating-value">
              {averageRating > 0 ? averageRating.toFixed(1) : 'Nuevo'} 
              {productReviews.length > 0 && ` (${productReviews.length} reseñas)`}
            </span>
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
              {orderLoading ? 'Procesando...' : 
               currentOrder ? 'Agregar al carrito' : 'Crear carrito'}
            </button>
            {orderError && <div className="error-message">{orderError}</div>}
          </div>
          
          <div className="stock-message">
            Stock limitado
          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reseñas del producto</h2>
          {isAuthenticated && (
            <button 
              className="add-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
            </button>
          )}
        </div>

        {/* Formulario para nueva reseña */}
        {showReviewForm && (
          <div className="review-form-container">
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="rating-input">
                <label>Calificación:</label>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className="star-input"
                      fill={star <= newReview.rating ? '#f59e0b' : 'none'}
                      color={star <= newReview.rating ? '#f59e0b' : '#d1d5db'}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    />
                  ))}
                </div>
              </div>
              
              <div className="comment-input">
                <label htmlFor="comment">Comentario:</label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este producto..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={reviewsLoading}
                  className="submit-review-btn"
                >
                  {reviewsLoading ? 'Enviando...' : 'Enviar reseña'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="reviews-list">
          {reviewsLoading && <div className="loading-reviews">Cargando reseñas...</div>}
          
          {productReviews.length === 0 && !reviewsLoading && (
            <div className="no-reviews">
              <p>Aún no hay reseñas para este producto.</p>
              {isAuthenticated && (
                <p>¡Sé el primero en dejar una reseña!</p>
              )}
            </div>
          )}
          
          {productReviews.length > 0 && (
            <div className="reviews-summary">
              <p>Total de reseñas: {productReviews.length}</p>
              <p>Promedio: {averageRating.toFixed(1)} estrellas</p>
            </div>
          )}
          
          {productReviews.map((review, index) => (
            <div key={review._id || review.id || index} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <User size={20} className="user-icon" />
                  <span className="reviewer-name">
                    {getReviewerName(review)}
                  </span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating || 0)}
                </div>
              </div>
              
              <div className="review-content">
                <p>{getReviewComment(review)}</p>
              </div>
              
              <div className="review-date">
                {getReviewDate(review)}
              </div>
            </div>
          ))}
        </div>

        {reviewsError && (
          <div className="error-message">
            Error al cargar reseñas: {reviewsError}
          </div>
        )}
      </div>
    </div>
  );
}