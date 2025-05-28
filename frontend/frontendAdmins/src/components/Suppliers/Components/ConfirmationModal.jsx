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
        return <MdWarning {...iconProps} aria-label="Advertencia" />;
      case 'success':
        return <MdCheckCircle {...iconProps} aria-label="Éxito" />;
      default:
        return <MdWarning {...iconProps} aria-label="Advertencia" />;
    }
  };

  return (
    <div 
      className="confirmation-backdrop" 
      onClick={handleBackdropClick}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-message"
    >
      <div className="confirmation-container">
        <header className="confirmation-header">
          <button 
            className="confirmation-close-btn"
            onClick={onClose}
            type="button"
            aria-label="Cerrar diálogo"
          >
            <MdClose />
          </button>
        </header>
        
        <section className="confirmation-content">
          {getIcon()}
          <h3 id="confirmation-title" className="confirmation-title">{title}</h3>
          <p id="confirmation-message" className="confirmation-message">
            {message}
            {supplierName && <span className="supplier-highlight"> "{supplierName}"</span>}?
          </p>
        </section>

        <footer className="confirmation-actions">
          <button
            type="button"
            className="btn btn-cancel-confirmation"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn btn-confirm-${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfirmationModal;
