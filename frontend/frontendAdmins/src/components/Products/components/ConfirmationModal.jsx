import React from 'react';
import { MdWarning, MdCheckCircle, MdClose, MdError, MdInfo } from 'react-icons/md';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <MdWarning />;
      case 'success':
        return <MdCheckCircle />;
      case 'error':
        return <MdError />;
      case 'info':
        return <MdInfo />;
      default:
        return <MdWarning />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'warning':
        return 'btn-warning';
      case 'error':
        return 'btn-danger';
      case 'success':
        return 'btn-success';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-warning';
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container confirmation-modal">
        <div className="modal-header">
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            type="button"
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        <div className="confirmation-content">
          <div className={`confirmation-icon ${type}`}>
            {getIcon()}
          </div>
          
          <h3 className="confirmation-title">{title}</h3>
          
          <div className="confirmation-message">
            <p>{message}</p>
            {itemName && (
              <p className="confirmation-item-name">
                <strong>"{itemName}"</strong>
              </p>
            )}
          </div>

          <div className="confirmation-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-cancel"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`btn ${getButtonClass()}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Procesando...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;