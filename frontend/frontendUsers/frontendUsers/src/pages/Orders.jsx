import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authenticacionContext';
import useOrders from '../components/hooks/useDataCart';
import '../css/cart.css';
import '../css/orders.css';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Estados locales
  const [localOrders, setLocalOrders] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price_high, price_low
  const [filterBy, setFilterBy] = useState('all'); // all, this_month, last_month, this_year
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Obtén solo las funciones del hook
  const { getOrders, loading, error } = useOrders();

  // Función para calcular el total de una orden específica - MOVER AQUÍ
  const calculateOrderTotal = (order) => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    
    return order.products.reduce((total, product) => {
      const productPrice = product.productID?.price || 0;
      const productAmount = product?.amount || 0;
      return total + (productPrice * productAmount);
    }, 0);
  };

  // Cargar las órdenes SOLO al montar el componente
  useEffect(() => {
    const loadInitialOrders = async () => {
      if (isAuthenticated && user?.id) {
        try {
          setInitialLoading(true);
          console.log('Cargando órdenes completadas para usuario:', user.id);
          
          const data = await getOrders(user.id);
          console.log('Órdenes cargadas:', data);
          setLocalOrders(data || []);
          
        } catch (err) {
          console.error('Error loading orders:', err);
          setLocalOrders([]);
        } finally {
          setInitialLoading(false);
        }
      } else {
        setInitialLoading(false);
        setLocalOrders([]);
      }
    };

    loadInitialOrders();
  }, [isAuthenticated, user?.id]);

  // Filtrar y ordenar órdenes con useMemo para optimización
  const processedOrders = useMemo(() => {
    if (!Array.isArray(localOrders)) return [];
    
    // Filtrar órdenes del usuario logueado Y que tengan status "Completed" o "Paid"
    let filtered = localOrders.filter(order => {
      const customerID = order.customersID?._id || order.customersID || order.customerId;
      const userID = user?.id || user?._id;
      const isUserOrder = customerID === userID;
      // Aceptar tanto "Completed" como "Paid" como órdenes completadas
      const isCompleted = order.status === 'Completed' || order.status === 'Paid';
      
      return isUserOrder && isCompleted;
    });

    // Aplicar filtro de fecha
    if (filterBy !== 'all') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt || order.updatedAt);
        const orderMonth = orderDate.getMonth();
        const orderYear = orderDate.getFullYear();
        
        switch (filterBy) {
          case 'this_month':
            return orderMonth === currentMonth && orderYear === currentYear;
          case 'last_month':
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            return orderMonth === lastMonth && orderYear === lastMonthYear;
          case 'this_year':
            return orderYear === currentYear;
          default:
            return true;
        }
      });
    }

    // Aplicar búsqueda por texto
    if (searchTerm.trim()) {
      filtered = filtered.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        const orderNumber = order._id?.toLowerCase() || '';
        const hasMatchingProduct = order.products?.some(product => {
          const productName = (product.productID?.productName || product.productID?.title || '').toLowerCase();
          const productCategory = (product.productID?.categoriesID?.categoryName || '').toLowerCase();
          return productName.includes(searchLower) || productCategory.includes(searchLower);
        });
        
        return orderNumber.includes(searchLower) || hasMatchingProduct;
      });
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt);
        case 'price_high':
          return calculateOrderTotal(b) - calculateOrderTotal(a);
        case 'price_low':
          return calculateOrderTotal(a) - calculateOrderTotal(b);
        default:
          return 0;
      }
    });

    return filtered;
  }, [localOrders, user, filterBy, searchTerm, sortBy]);

  // Paginación
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [processedOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedOrders.length / itemsPerPage);

  // Estadísticas
  const stats = useMemo(() => {
    const totalOrders = processedOrders.length;
    const totalSpent = processedOrders.reduce((sum, order) => sum + parseFloat(calculateOrderTotal(order)), 0);
    const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
    
    // Órdenes este mes
    const now = new Date();
    const thisMonthOrders = processedOrders.filter(order => {
      const orderDate = new Date(order.createdAt || order.updatedAt);
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalOrders,
      totalSpent,
      averageOrder,
      thisMonthOrders
    };
  }, [processedOrders]);



  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Fecha no disponible';
    }
  };

  // Función para reordenar productos
  const handleReorder = (order) => {
    // Aquí implementarías la lógica para agregar los productos al carrito
    console.log('Reordenando productos de la orden:', order._id);
    // Ejemplo: addToCart(order.products);
  };

  // Función para ver detalles
  const handleViewDetails = (orderId) => {
    // Aquí podrías navegar a una página de detalles o mostrar un modal
    console.log('Ver detalles de la orden:', orderId);
  };

  if (initialLoading) {
    return (
      <div className="cart-page">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error && localOrders.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <h2>Error al cargar órdenes</h2>
            <p>Ha ocurrido un error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="browse-products-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <h2>Debes iniciar sesión</h2>
            <p>Para ver tus órdenes completadas, necesitas iniciar sesión en tu cuenta.</p>
            <Link to="/login" className="browse-products-btn">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Mis Órdenes Completadas</h1>
        
        {/* Estadísticas */}
        {processedOrders.length > 0 && (
          <div className="orders-stats">
            <div className="stats-card">
              <div className="stats-number">{stats.totalOrders}</div>
              <div className="stats-label">Órdenes Totales</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">${stats.totalSpent.toFixed(2)}</div>
              <div className="stats-label">Total Gastado</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">${stats.averageOrder.toFixed(2)}</div>
              <div className="stats-label">Promedio por Orden</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.thisMonthOrders}</div>
              <div className="stats-label">Este Mes</div>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        {processedOrders.length > 0 && (
          <div className="orders-filters">
            <input
              type="text"
              placeholder="Buscar por orden o producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-input"
            />
            
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">Todas las fechas</option>
              <option value="this_month">Este mes</option>
              <option value="last_month">Mes pasado</option>
              <option value="this_year">Este año</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="price_high">Mayor precio</option>
              <option value="price_low">Menor precio</option>
            </select>
          </div>
        )}
        
        {processedOrders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h2>
              {searchTerm || filterBy !== 'all' 
                ? 'No se encontraron órdenes' 
                : 'No tienes órdenes completadas'
              }
            </h2>
            <p>
              {searchTerm || filterBy !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Cuando completes una compra, aparecerá aquí tu historial de órdenes.'
              }
            </p>
            {searchTerm || filterBy !== 'all' ? (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                  setCurrentPage(1);
                }}
                className="browse-products-btn"
              >
                Limpiar Filtros
              </button>
            ) : (
              <Link to="/productos" className="browse-products-btn">
                Explorar Productos
              </Link>
            )}
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-container">
              {paginatedOrders.map(order => (
                <div key={order._id} className="order-wrapper">
                  {/* Header de la orden */}
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-details">
                        <h3>Orden #{order._id?.slice(-8) || 'N/A'}</h3>
                        <p className="order-date">
                          {formatDate(order.createdAt || order.updatedAt)}
                        </p>
                      </div>
                      <div className="order-summary">
                        <div className="status-badge">
                          {order.status === 'Paid' ? 'Pagada' : 'Completada'}
                        </div>
                        <div className="order-total">
                          Total: ${calculateOrderTotal(order).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Productos de la orden */}
                  <div className="order-products-container">
                    {order.products && Array.isArray(order.products) ? order.products.map((product, index) => {
                      const productInfo = product.productID || {};
                      const productName = productInfo.productName || productInfo.title || 'Producto no disponible';
                      const productPrice = productInfo.price || 0;
                      const productImage = productInfo.image || '/placeholder-product.png';
                      const productCategory = productInfo.categoriesID?.categoryName || productInfo.category || 'Categoría no disponible';
                      const productDescription = productInfo.productDescription || productInfo.description || 'Descripción no disponible';
                      
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
                            <p className="cart-item-description">
                              {productDescription.length > 100 
                                ? `${productDescription.substring(0, 100)}...` 
                                : productDescription
                              }
                            </p>
                            <div className="cart-item-controls">
                              <div className="quantity-display">
                                <span>Cantidad: <strong>{product?.amount || 0}</strong></span>
                              </div>
                              <div className="product-subtotal">
                                ${(productPrice * (product?.amount || 0)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="cart-item-card">
                        <p>No hay productos disponibles para esta orden.</p>
                      </div>
                    )}
                  </div>

                  {/* Información adicional y acciones */}
                  <div className="order-additional-info">
                    <div className="order-id-display">
                      ID: {order._id}
                    </div>
                    <div className="order-actions">
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="order-action-btn view-details-btn"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="order-action-btn reorder-btn"
                      >
                        Reordenar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="orders-pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  ← Anterior
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 3 ||
                    pageNumber === currentPage + 3
                  ) {
                    return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Información de resultados */}
            <div className="results-info" style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
              Mostrando {Math.min(processedOrders.length, itemsPerPage)} de {processedOrders.length} órdenes
              {(searchTerm || filterBy !== 'all') && (
                <span> (filtradas de {localOrders.filter(order => {
                  const customerID = order.customersID?._id || order.customersID || order.customerId;
                  const userID = user?.id || user?._id;
                  return customerID === userID && (order.status === 'Completed' || order.status === 'Paid');
                }).length} totales)</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;