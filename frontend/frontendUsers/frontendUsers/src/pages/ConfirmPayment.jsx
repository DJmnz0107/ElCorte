import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CreditCard from '../components/CreditCard';
import OrderSummary from '../components/OrderSummary';
import PaymentForm from '../components/PaymentForm';
import useOrders from '../components/hooks/useDataCart';
import usePurchases from '../components/hooks/usePurchases';
import usePaymentMethods from '../components/hooks/useDataPaymentMethod';
import { useAuth } from '../context/authenticacionContext';
import '../css/confirmPayment.css';

// Constantes para validaciones
const CARD_NUMBER_LENGTH = 16;
const CVV_LENGTH = 3;
const EXPIRY_DATE_LENGTH = 5;

// Utilidades para formateo
const formatCardNumber = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\s+/g, '').replace(/[^\d]/g, '');
  if (cleaned.length > CARD_NUMBER_LENGTH) return value;
  
  let formatted = '';
  for (let i = 0; i < cleaned.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += cleaned[i];
  }
  return formatted;
};

const formatExpiryDate = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/[^\d]/g, '');
  if (cleaned.length > 4) return value;
  
  if (cleaned.length > 2) {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }
  return cleaned;
};

const formatCVV = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned.length > CVV_LENGTH ? value : cleaned;
};

// Validaciones
const validateCardNumber = (cardNumber) => {
  if (!cardNumber) return false;
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.length === CARD_NUMBER_LENGTH;
};

const validateCVV = (cvv) => {
  if (!cvv) return false;
  return cvv.length === CVV_LENGTH;
};

const validateExpiryDate = (expiryDate) => {
  if (!expiryDate || expiryDate.length !== EXPIRY_DATE_LENGTH) return false;
  
  const [month, year] = expiryDate.split('/');
  if (!month || !year) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (isNaN(expMonth) || isNaN(expYear)) return false;
  if (expMonth < 1 || expMonth > 12) return false;
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  
  return true;
};

const validateFormData = (formData) => {
  const errors = [];
  
  if (!formData?.email?.trim()) errors.push('Email es requerido');
  if (!formData?.cardNumber?.trim()) errors.push('Número de tarjeta es requerido');
  if (!formData?.cardHolder?.trim()) errors.push('Nombre del titular es requerido');
  if (!formData?.expiryDate?.trim()) errors.push('Fecha de expiración es requerida');
  if (!formData?.cvv?.trim()) errors.push('CVV es requerido');
  if (!formData?.address?.trim()) errors.push('Dirección es requerida');
  
  if (formData?.cardNumber && !validateCardNumber(formData.cardNumber)) {
    errors.push('El número de tarjeta debe tener 16 dígitos');
  }
  
  if (formData?.cvv && !validateCVV(formData.cvv)) {
    errors.push('El CVV debe tener 3 dígitos');
  }
  
  if (formData?.expiryDate && !validateExpiryDate(formData.expiryDate)) {
    errors.push('La fecha de expiración es inválida o está vencida');
  }
  
  return errors;
};

// Componente Toast
const Toast = ({ message, type = 'info', onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

// Hook para manejar toasts
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
};

const ConfirmPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  
  // Estados para manejo de errores
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);
  
  // Hooks - con manejo de errores
  let useOrdersHook, usePurchasesHook, usePaymentMethodsHook;
  
  try {
    useOrdersHook = useOrders();
    usePurchasesHook = usePurchases();
    usePaymentMethodsHook = usePaymentMethods();
  } catch (hookError) {
    console.error('Error inicializando hooks:', hookError);
    setError('Error inicializando la aplicación');
    setHasError(true);
  }
  
  const { getOrderById, updateOrder, loading: orderLoading } = useOrdersHook || {};
  const { createPurchase, loading: purchaseLoading } = usePurchasesHook || {};
  const { createPaymentMethod, loading: paymentMethodLoading } = usePaymentMethodsHook || {};
  
  // Estados principales
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: ''
  });

  // Loading combinado
  const loading = orderLoading || purchaseLoading || paymentMethodLoading || processingPayment;

  // Formatear productos de la orden
  const formatOrderProducts = useCallback((products) => {
    try {
      if (!products || !Array.isArray(products)) return [];
      
      return products.map(product => {
        const productInfo = product?.productID || {};
        return {
          id: productInfo._id || product.productID || `temp-${Date.now()}`,
          name: productInfo.productName || productInfo.title || productInfo.name || 'Producto',
          quantity: product.amount || 1,
          price: productInfo.price || 0,
          subTotal: product.subTotal || ((productInfo.price || 0) * (product.amount || 1)),
          image: productInfo.image || '/placeholder-product.png',
          unit: productInfo.unit || 'unidad'
        };
      });
    } catch (error) {
      console.error('Error formateando productos:', error);
      return [];
    }
  }, []);

  // Verificar permisos de usuario
  const verifyUserPermissions = useCallback((orderData, currentUser) => {
    try {
      if (!orderData || !currentUser) return false;
      
      const orderCustomerID = orderData.customersID?._id || orderData.customersID || orderData.customerId;
      const currentUserID = currentUser?.id || currentUser?._id;
      return orderCustomerID === currentUserID;
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return false;
    }
  }, []);

  // Cargar datos de la orden
  const loadOrderData = useCallback(async () => {
    try {
      setLoadingOrder(true);
      setError(null);
      setHasError(false);
      
      if (!isAuthenticated || !user) {
        navigate('/login');
        return;
      }
      
      const currentOrderId = orderId || location.state?.orderId;
      
      if (!currentOrderId) {
        throw new Error('No se encontró la información de la orden');
      }

      let orderData;

      // Usar datos del estado si están disponibles
      if (location.state?.orderData) {
        orderData = location.state.orderData;
        
        if (!verifyUserPermissions(orderData, user)) {
          throw new Error('No tienes permisos para ver esta orden');
        }
        
        setTotal(location.state?.total || orderData.total || 0);
      } else {
        // Cargar desde la API
        if (!getOrderById) {
          throw new Error('Servicio de órdenes no disponible');
        }
        
        orderData = await getOrderById(currentOrderId);
        
        if (!orderData) {
          throw new Error('No se encontró la orden');
        }

        if (!verifyUserPermissions(orderData, user)) {
          throw new Error('No tienes permisos para ver esta orden');
        }

        if (orderData.status !== 'Pending') {
          throw new Error('Esta orden no está disponible para pago');
        }
        
        setTotal(orderData.total || 0);
      }

      setOrder(orderData);
      setOrderItems(formatOrderProducts(orderData.products));
      
    } catch (error) {
      console.error('Error cargando orden:', error);
      setError(error.message);
      setHasError(true);
      showToast(error.message, 'error');
      
      // Solo navegar si no es un error de permisos o datos
      if (!error.message.includes('permisos') && !error.message.includes('disponible')) {
        setTimeout(() => navigate('/cart'), 2000);
      }
    } finally {
      setLoadingOrder(false);
    }
  }, [orderId, location.state, isAuthenticated, user, navigate, getOrderById, verifyUserPermissions, formatOrderProducts, showToast]);

  // Manejar cambios en el formulario
  const handleChange = useCallback((e) => {
    try {
      const { name, value } = e.target;
      if (!name) return;

      let formattedValue = value || '';

      switch (name) {
        case 'cardNumber':
          formattedValue = formatCardNumber(value);
          break;
        case 'expiryDate':
          formattedValue = formatExpiryDate(value);
          break;
        case 'cvv':
          formattedValue = formatCVV(value);
          break;
        default:
          formattedValue = value;
      }

      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } catch (error) {
      console.error('Error manejando cambio de formulario:', error);
    }
  }, []);

  // Crear método de pago - CORREGIDO
  const createPaymentMethodRecord = useCallback(async (cardNumbers) => {
    try {
      console.log('=== CREANDO MÉTODO DE PAGO ===');

      // Convertir MM/YY a fecha válida para MongoDB
      const convertExpiryToDate = (expiryString) => {
        if (!expiryString || expiryString.length !== 5) {
          throw new Error('Formato de fecha de expiración inválido');
        }
        
        const [month, year] = expiryString.split('/');
        const fullYear = 2000 + parseInt(year);
        
        const expirationDate = new Date(fullYear, parseInt(month) - 1, 1);
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        expirationDate.setDate(0);
        
        return expirationDate.toISOString();
      };

      const paymentMethodData = {
        customerId: user?.id || user?._id,
        paymentMethodType: 'Credit Card',
        cardNumber: cardNumbers,
        cardHolderName: formData.cardHolder,
        expirationDate: convertExpiryToDate(formData.expiryDate),
        cvv: formData.cvv
      };

      console.log('Datos del método de pago a enviar:', paymentMethodData);

      const response = await createPaymentMethod(paymentMethodData);
      console.log('Respuesta completa del servidor:', response);

      // CORREGIDO: Manejo más robusto de la respuesta
      let createdPaymentMethod;
      
      if (response?.data?._id) {
        // Nueva estructura: { message: "...", data: { _id: "ObjectId", ... } }
        createdPaymentMethod = response.data;
        console.log('✅ Método extraído de response.data:', createdPaymentMethod);
      } else if (response?._id) {
        // Respuesta directa con ObjectId
        createdPaymentMethod = response;
        console.log('✅ Método directo:', createdPaymentMethod);
      } else {
        // Si no hay ID válido, es un error crítico
        console.error('❌ Respuesta sin ObjectId válido:', response);
        throw new Error('El servidor no devolvió el método de pago con un ObjectId válido. Verifica la configuración del backend.');
      }

      // Verificar que el ID sea un ObjectId válido
      const paymentMethodId = createdPaymentMethod._id || createdPaymentMethod.id;
      
      if (!paymentMethodId) {
        throw new Error('El método de pago no tiene un ID válido');
      }

      // Validar formato de ObjectId (24 caracteres hexadecimales)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(paymentMethodId)) {
        console.error('❌ ID no es un ObjectId válido:', paymentMethodId);
        throw new Error(`El ID "${paymentMethodId}" no es un ObjectId válido de MongoDB`);
      }

      console.log('✅ Método de pago creado exitosamente con ObjectId:', paymentMethodId);
      return createdPaymentMethod;

    } catch (error) {
      console.error('❌ Error creando método de pago:', error);
      throw new Error(`Error al crear método de pago: ${error.message}`);
    }
  }, [user, formData.cardHolder, formData.expiryDate, formData.cvv, createPaymentMethod]);

  // Crear registro de compra - MEJORADO
  const createPurchaseRecord = useCallback(async (paymentMethod, cardNumbers) => {
    try {
      console.log('=== CREANDO COMPRA ===');
      console.log('PaymentMethod recibido:', paymentMethod);

      const paymentMethodId = paymentMethod._id || paymentMethod.id;
      
      if (!paymentMethodId) {
        console.error('❌ PaymentMethod sin ID válido:', paymentMethod);
        throw new Error('El método de pago no tiene un ID válido');
      }

      // Validar que es un ObjectId válido antes de enviarlo
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(paymentMethodId)) {
        console.error('❌ PaymentMethodID no es un ObjectId válido:', paymentMethodId);
        throw new Error(`El ID del método de pago "${paymentMethodId}" no es un ObjectId válido`);
      }

      const purchaseData = {
        customersID: user?.id || user?._id,
        orderID: order._id,
        paymentMethodID: paymentMethodId, // Asegurar que es un ObjectId válido
        products: order.products.map(product => ({
          productID: product.productID?._id || product.productID,
          amount: product.amount,
          subTotal: product.subTotal || ((product.productID?.price || 0) * (product.amount || 0)),
          productName: product.productID?.productName || product.productID?.title || product.productID?.name,
          productPrice: product.productID?.price || 0
        })),
        total: total,
        paymentInfo: {
          email: formData.email,
          cardLastFour: cardNumbers.slice(-4),
          cardHolder: formData.cardHolder,
          paymentMethodType: 'Credit Card'
        },
        address: formData.address,
        purchaseDate: new Date().toISOString(),
        status: 'Completed'
      };

      console.log('Datos de la compra a enviar:', purchaseData);
      console.log('PaymentMethodID a enviar:', purchaseData.paymentMethodID);

      const createdPurchase = await createPurchase(purchaseData);
      console.log('✅ Compra creada exitosamente:', createdPurchase);
      
      if (!createdPurchase) {
        throw new Error('No se pudo crear el registro de compra');
      }

      return createdPurchase;
    } catch (error) {
      console.error('❌ Error creando compra:', error);
      throw new Error(`Error al crear compra: ${error.message}`);
    }
  }, [user, order, total, formData, createPurchase]);

  // MOVED: Actualizar orden - NOW DEFINED BEFORE handlePayment
  const updateOrderRecord = useCallback(async (paymentMethod, purchase, cardNumbers) => {
    try {
      console.log('Actualizando orden...');

      const paymentMethodId = paymentMethod._id || paymentMethod.id;
      const purchaseId = purchase._id || purchase.id;

      const updatedOrderData = {
        customersID: user?.id || user?._id,
        products: order.products,
        total: total,
        status: "Completed",
        paymentMethodID: paymentMethodId,
        paymentInfo: {
          email: formData.email,
          cardLastFour: cardNumbers.slice(-4),
          paymentDate: new Date().toISOString(),
          paymentMethodType: 'Credit Card'
        },
        address: formData.address,
        purchaseID: purchaseId
      };

      console.log('Datos de actualización de orden:', updatedOrderData);

      const updatedOrder = await updateOrder(order._id, updatedOrderData);
      console.log('Orden actualizada exitosamente:', updatedOrder);
      
      if (!updatedOrder) {
        throw new Error('No se pudo actualizar la orden');
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error actualizando orden:', error);
      throw new Error(`Error al actualizar orden: ${error.message}`);
    }
  }, [user, order, total, formData, updateOrder]);

  // Procesar pago - MEJORADO con mejor manejo de errores
  const handlePayment = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      // Validar formulario
      const validationErrors = validateFormData(formData);
      if (validationErrors.length > 0) {
        showToast(validationErrors.join(', '), 'warning');
        return;
      }

      setProcessingPayment(true);
      console.log('=== INICIANDO PROCESO DE PAGO ===');
      
      const cardNumbers = formData.cardNumber.replace(/\s/g, '');

      // Paso 1: Crear método de pago
      console.log('=== PASO 1: CREANDO MÉTODO DE PAGO ===');
      showToast('Procesando método de pago...', 'info');
      const paymentMethod = await createPaymentMethodRecord(cardNumbers);
      console.log('✅ Método de pago creado exitosamente');

      // Verificar que el método de pago tiene un ObjectId válido antes de continuar
      if (!paymentMethod._id && !paymentMethod.id) {
        throw new Error('El método de pago creado no tiene un ID válido');
      }

      // Paso 2: Crear compra
      console.log('=== PASO 2: CREANDO COMPRA ===');
      showToast('Registrando compra...', 'info');
      const purchase = await createPurchaseRecord(paymentMethod, cardNumbers);
      console.log('✅ Compra creada exitosamente');

      // Paso 3: Actualizar orden
      console.log('=== PASO 3: ACTUALIZANDO ORDEN ===');
      showToast('Finalizando orden...', 'info');
      const updatedOrder = await updateOrderRecord(paymentMethod, purchase, cardNumbers);
      console.log('✅ Orden actualizada exitosamente');

      console.log('=== PROCESO DE PAGO COMPLETADO EXITOSAMENTE ===');
      
      // Mostrar mensaje de éxito con detalles
      const successMessage = `¡Pago procesado exitosamente! 🎉 
      Total pagado: $${total.toFixed(2)} - Confirmación enviada a: ${formData.email}`;
      
      showToast(successMessage, 'success', 8000);
      
      // Navegar al inicio o historial de compras
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
      
    } catch (error) {
      console.error('=== ERROR EN EL PROCESO DE PAGO ===');
      console.error('Error completo:', error);
      
      let errorMessage = 'Error desconocido en el proceso de pago';
      
      if (error.message.includes('ObjectId')) {
        errorMessage = 'Error con el ID del método de pago. Por favor, contacta soporte técnico.';
      } else if (error.message.includes('método de pago')) {
        errorMessage = 'Error al registrar el método de pago. Verifica los datos de tu tarjeta.';
      } else if (error.message.includes('compra')) {
        errorMessage = 'Error al procesar la compra. El método de pago podría no estar disponible.';
      } else if (error.message.includes('orden')) {
        errorMessage = 'Error al actualizar la orden. Contacta soporte.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showToast(`Error al procesar el pago: ${errorMessage}`, 'error', 10000);
    } finally {
      setProcessingPayment(false);
    }
  }, [formData, createPaymentMethodRecord, createPurchaseRecord, updateOrderRecord, navigate, order, total, showToast]);

  // Efectos
  useEffect(() => {
    if (!hasError) {
      loadOrderData();
    }
  }, [loadOrderData, hasError]);

  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [user?.email, formData.email]);

  // Renderizado condicional para errores
  if (hasError) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Ha ocurrido un error inesperado'}</p>
          <button onClick={() => navigate('/cart')} className="back-button">
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  if (loadingOrder) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <h2>Cargando información de la orden...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <h2>No se encontró la orden</h2>
          <button onClick={() => navigate('/cart')} className="back-button">
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="content-container">
        <div className="payment-header">
          <button 
            onClick={() => navigate('/cart')}
            className="back-button"
            disabled={loading}
          >
            ← Volver al carrito
          </button>
          <h1>Confirmar Pago</h1>
        </div>

        <div className="grid-layout">
          {/* Columna izquierda - Resumen de orden */}
          <div className="left-column">
            <OrderSummary
              items={orderItems}
              total={total.toFixed(2)}
            />
          </div>

          {/* Columna derecha - Tarjeta y formulario */}
          <div className="right-column">
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
              onSubmit={handlePayment}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;