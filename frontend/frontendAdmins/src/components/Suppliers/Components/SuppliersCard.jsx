import React from 'react';
import { MdEdit, MdDelete, MdPhone, MdLocationOn } from 'react-icons/md';
import '../css/supplierCard.css';

const SupplierCard = ({ supplier, onEdit, onDelete }) => {
  return (
    <article className="supplier-card" aria-label={`Proveedor ${supplier.suppliersName}`}>
      <header className="supplier-card-header">
        <h3 className="supplier-name">{supplier.suppliersName}</h3>
      </header>
      
      <section className="supplier-card-body">
        <div className="supplier-info">
          <div className="info-item">
            <MdPhone className="info-icon" aria-hidden="true" />
            <span className="info-label">Teléfono:</span>
            <span className="info-value">{supplier.phone}</span>
          </div>
          
          <div className="info-item">
            <MdLocationOn className="info-icon" aria-hidden="true" />
            <span className="info-label">Dirección:</span>
            <span className="info-value">{supplier.address}</span>
          </div>
        </div>
      </section>
      
      <footer className="supplier-card-footer">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(supplier)}
          aria-label={`Editar proveedor ${supplier.suppliersName}`}
        >
          <MdEdit className="btn-icon" aria-hidden="true" />
          Editar
        </button>
        
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(supplier)} 
          aria-label={`Eliminar proveedor ${supplier.suppliersName}`}
        >
          <MdDelete className="btn-icon" aria-hidden="true" />
          Eliminar
        </button>
      </footer>
    </article>
  );
};

export default SupplierCard;