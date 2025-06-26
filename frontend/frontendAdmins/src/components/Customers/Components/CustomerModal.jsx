import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import '../css/customerModal.css';

const CustomerModal = ({
  isOpen,
  onClose,
  onSave,
  customer = null,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer && mode === 'edit') {
      setFormData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        password: '',
        dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
      });
    }
    setErrors({});
  }, [customer, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    if (mode === 'add' && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    } else {
      const today = new Date();
      const inputDate = new Date(formData.dateOfBirth);
      if (inputDate >= today) {
        newErrors.dateOfBirth = 'La fecha debe ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const customerData = {
        id: customer?.id || Date.now(),
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      };

      if (mode === 'edit' && !formData.password.trim()) {
        delete customerData.password;
      }

      onSave(customerData);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <header className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? 'Agregar Cliente' : 'Editar Cliente'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              autoComplete="off"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              autoComplete="off"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Correo electrónico <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              autoComplete="off"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña 
              {mode === 'add' && <span className="required">*</span>}
              {mode === 'edit' && <span className="optional"> (dejar vacío para mantener actual)</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              autoComplete="off"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth" className="form-label">
              Fecha de nacimiento <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
            />
            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-save">
              {mode === 'add' ? 'Agregar' : 'Editar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;