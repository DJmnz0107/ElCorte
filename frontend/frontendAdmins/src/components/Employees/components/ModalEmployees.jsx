import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import '../css/employeeModal.css';

const EmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  employee = null,
  mode = 'add'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    EmployeeDui: '',
    address: '',
    birthdate: '',
    salary: '',
    role: 'Employee',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee && mode === 'edit') {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        password: '',
        EmployeeDui: employee.EmployeeDui || '',
        address: employee.address || '',
        birthdate: employee.birthdate || '',
        salary: employee.salary?.toString() || '',
        role: 'Employee',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        EmployeeDui: '',
        address: '',
        birthdate: '',
        salary: '',
        role: 'Employee',
      });
    }
    setErrors({});
  }, [employee, mode, isOpen]);

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

    if (!/^\d{8}-\d{1}$/.test(formData.EmployeeDui)) {
      newErrors.EmployeeDui = 'Formato de DUI inválido (ej: 12345678-9)';
    }

    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';

    if (!formData.birthdate.trim()) {
      newErrors.birthdate = 'La fecha de nacimiento es requerida';
    } else {
      const today = new Date();
      const inputDate = new Date(formData.birthdate);
      if (inputDate >= today) {
        newErrors.birthdate = 'La fecha debe ser anterior a hoy';
      }
    }

    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'El salario debe ser un número mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // DUI autoformateado
    if (name === 'EmployeeDui') {
      const cleaned = value.replace(/\D/g, '').slice(0, 9);
      const formatted = cleaned.length > 8 ? `${cleaned.slice(0, 8)}-${cleaned.slice(8)}` : cleaned;
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const employeeData = {
        id: employee?.id || Date.now(),
        ...formData,
        salary: parseFloat(formData.salary),
      };

      if (mode === 'edit' && !formData.password.trim()) {
        delete employeeData.password;
      }

      onSave(employeeData);
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
            {mode === 'add' ? 'Agregar Empleado' : 'Editar Empleado'}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <MdClose />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {[
            { id: 'firstName', label: 'Nombre' },
            { id: 'lastName', label: 'Apellido' },
            { id: 'email', label: 'Correo electrónico', type: 'email' },
            { id: 'password', label: 'Contraseña', type: 'password' },
            { id: 'EmployeeDui', label: 'DUI (12345678-9)' },
            { id: 'address', label: 'Dirección' },
            { id: 'birthdate', label: 'Fecha de nacimiento', type: 'date' },
            { id: 'salary', label: 'Salario', type: 'number' },
            { id: 'role', label: 'Rol', readOnly: true },
          ].map(({ id, label, type = 'text', readOnly = false }) => (
            <div key={id} className="form-group">
              <label htmlFor={id} className="form-label">
                {label}{' '}
                {(id !== 'password' || mode === 'add') && (
                  <span className="required">*</span>
                )}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleInputChange}
                className={`form-input ${errors[id] ? 'error' : ''}`}
                readOnly={readOnly}
                maxLength={id === 'EmployeeDui' ? 10 : undefined}
                autoComplete="off"
              />
              {errors[id] && <span className="error-message">{errors[id]}</span>}
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-save">{mode === 'add' ? 'Agregar' : 'Editar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
