import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import '../css/supplierModal.css';

const SupplierModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  supplier = null, 
  mode = 'add' // 'add' o 'edit'
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier && mode === 'edit') {
      setFormData({
        nombre: supplier.suppliersName || '',
        telefono: supplier.phone || '',
        direccion: supplier.address || ''
      });
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        direccion: ''
      });
    }
    setErrors({});
  }, [supplier, mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{4}-\d{4}$/.test(formData.telefono)) {
      newErrors.telefono = 'El formato debe ser: 0000-0000';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí mapeamos formData a las keys que usa el backend
      const supplierData = {
        id: supplier?.id || Date.now(), // temporal para nuevo
        suppliersName: formData.nombre.trim(),
        phone: formData.telefono.trim(),
        address: formData.direccion.trim()
      };
      onSave(supplierData);
      // No cierres modal aquí si quieres que confirmación salga después, pero si quieres cerrar aquí:
      // onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container">
        <header className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {mode === 'add' ? 'Agregar Proveedor' : 'Editar Proveedor'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Cerrar modal">
            <MdClose />
          </button>
        </header>
        
        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre <span aria-hidden="true" className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              placeholder="Ingrese el nombre del proveedor"
              aria-invalid={errors.nombre ? "true" : "false"}
              aria-describedby={errors.nombre ? "error-nombre" : undefined}
              autoComplete="off"
            />
            {errors.nombre && <span id="error-nombre" className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono <span aria-hidden="true" className="required">*</span>
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className={`form-input ${errors.telefono ? 'error' : ''}`}
              placeholder="0000-0000"
              maxLength={9}
              aria-invalid={errors.telefono ? "true" : "false"}
              aria-describedby={errors.telefono ? "error-telefono" : undefined}
              autoComplete="off"
            />
            {errors.telefono && <span id="error-telefono" className="error-message">{errors.telefono}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="direccion" className="form-label">
              Dirección <span aria-hidden="true" className="required">*</span>
            </label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={`form-textarea ${errors.direccion ? 'error' : ''}`}
              placeholder="Ingrese la dirección completa"
              rows={4}
              aria-invalid={errors.direccion ? "true" : "false"}
              aria-describedby={errors.direccion ? "error-direccion" : undefined}
            />
            {errors.direccion && <span id="error-direccion" className="error-message">{errors.direccion}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-save">{mode === 'add' ? 'Agregar' : 'Editar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
