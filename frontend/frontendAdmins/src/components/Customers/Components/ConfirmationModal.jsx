import React from 'react';
import { MdClose, MdWarning, MdCheckCircle } from 'react-icons/md';
import '../css/confirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  type = 'warning', // 'warning' o 'success'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  supplierName = ''
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const iconProps = {
    className: 'modal-icon',
    'aria-hidden': true,
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <MdWarning {...iconProps} />;
      case 'success':
        return <MdCheckCircle {...iconProps} />;
      default:
        return <MdWarning {...iconProps} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="confirmation-modal-container">
        <div className="confirmation-modal-header">
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <MdClose />
          </button>
        </div>
        
        <div className="confirmation-modal-content">
          {getIcon()}
          <h2 className="confirmation-title">{title}</h2>
          
          <div className="confirmation-message">
            {message}
            {supplierName && <strong> "{supplierName}"</strong>}?
          </div>
        </div>

        <div className="confirmation-modal-actions">
          <button 
            className="btn btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${type === 'warning' ? 'btn-danger' : 'btn-success'}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;