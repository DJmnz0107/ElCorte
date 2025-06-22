import React from 'react';
import { MdEdit, MdDelete, MdEmail, MdPerson, MdCake } from 'react-icons/md';
import '../css/customerCard.css'; 

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="customer-card">
      <div className="card-header">
        <div className="customer-avatar">
          <MdPerson className="avatar-icon" />
        </div>
        <div className="customer-name">
          <h3>{customer.firstName} {customer.lastName}</h3>
        </div>
      </div>

      <div className="card-body">
        <div className="customer-details">
          <div className="detail-item">
            <MdEmail className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Correo:</span>
              <span className="detail-value">{customer.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <MdCake className="detail-icon" />
            <div className="detail-content">
              <span className="detail-label">Fecha de nacimiento:</span>
              <span className="detail-value">{formatDate(customer.dateOfBirth)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button 
          className="btn btn-edit"
          onClick={() => onEdit(customer)}
          aria-label={`Editar cliente ${customer.firstName} ${customer.lastName}`}
        >
          <MdEdit />
          Editar
        </button>
        <button 
          className="btn btn-delete"
          onClick={() => onDelete(customer)} 
          aria-label={`Eliminar cliente ${customer.firstName} ${customer.lastName}`}
        >
          <MdDelete />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;