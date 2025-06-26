import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import '../css/categoryModal.css';

const CategoryModal = ({
  isOpen,
  onClose,
  onSave,
  category = null,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        categoryName: category.categoryName || '',
        categoryDescription: category.categoryDescription || '',
      });
    } else {
      setFormData({
        categoryName: '',
        categoryDescription: '',
      });
    }
    setErrors({});
  }, [category, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryName.trim()) newErrors.categoryName = 'El nombre es requerido';
    if (!formData.categoryDescription.trim()) newErrors.categoryDescription = 'La descripción es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const categoryData = {
        id: category?.id || Date.now(),
        ...formData,
      };
      onSave(categoryData);
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
            {mode === 'add' ? 'Agregar Categoría' : 'Editar Categoría'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label htmlFor="categoryName" className="form-label">
              Nombre de la categoría <span className="required">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              className={`form-input ${errors.categoryName ? 'error' : ''}`}
              autoComplete="off"
            />
            {errors.categoryName && <span className="error-message">{errors.categoryName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription" className="form-label">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="categoryDescription"
              name="categoryDescription"
              value={formData.categoryDescription}
              onChange={handleInputChange}
              className={`form-input ${errors.categoryDescription ? 'error' : ''}`}
              rows={4}
            />
            {errors.categoryDescription && (
              <span className="error-message">{errors.categoryDescription}</span>
            )}
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

export default CategoryModal;
