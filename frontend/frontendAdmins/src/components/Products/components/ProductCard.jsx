import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-SV', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <div className="product-image-container">
        {product.image ? (
          <img 
            src={product.image}
            alt={product.productName}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">
            <span>Sin imagen</span>
          </div>
        )}
      </div>
      
      {/* Información del producto */}
      <div className="product-info">
        {/* Nombre del producto */}
        <h3 className="product-name">{product.productName}</h3>
        
        {/* Descripción del producto */}
        {product.productDescription && (
          <p className="product-description">{product.productDescription}</p>
        )}
        
        {/* Detalles del producto */}
        <div className="product-details">
          <div className="product-detail-row">
            <span className="detail-label">Stock:</span>
            <span className={`detail-value ${product.stock <= 10 ? 'low-stock' : ''}`}>
              {product.stock}
            </span>
          </div>
          
          <div className="product-detail-row">
            <span className="detail-label">Precio:</span>
            <span className="detail-value price">{formatPrice(product.price)}</span>
          </div>
          
          <div className="product-detail-row">
            <span className="detail-label">Proveedor:</span>
            <span className="detail-value">
              {product.supplier?.suppliersName || 
               product.suppliersID?.suppliersName || 
               'Sin proveedor'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="product-actions">
        <button
          onClick={() => onEdit(product)}
          className="action-btn edit-btn"
          title="Editar producto"
        >
          Editar
        </button>
        
        <button
          onClick={() => onDelete(product)}
          className="action-btn delete-btn"
          title="Eliminar producto"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;