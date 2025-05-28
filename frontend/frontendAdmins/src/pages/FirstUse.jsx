import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaEye, FaEyeSlash, FaUser, FaCalendarAlt, 
  FaIdCard, FaDollarSign, FaHome, FaLock, FaEnvelope
} from 'react-icons/fa';
import useDataAdminsInterface from '../components/Employees/hooks/useDataAdminsInterface';
import '../css/firstuse.css';

const FirstUse = () => {
  const navigate = useNavigate();
  const {
    formData,
    handleChange,
    loading,
    success,
    error,
    handleSubmit,
    setFormData
  } = useDataAdminsInterface();

  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const handleDuiChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8) + '-' + value.substring(8, 9);
    }
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    setFormData(prev => ({ ...prev, employeeDui: value }));
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSubmit(e);
    if (result) {
      // Redirigir automáticamente después del éxito
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
  };

  return (
    <div className="admin-firstuse-container">
      <div className="admin-firstuse-header">
        <h1 className="admin-firstuse-title">Crea tu primer cuenta de administrador</h1>
        <p className="admin-firstuse-subtitle">Esperamos que el sistema cumpla tus expectativas</p>
      </div>

      {error && (
        <div className="admin-firstuse-error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-firstuse-success-message">
          <div className="success-icon">✓</div>
          <div>
            <h3>¡Administrador creado exitosamente!</h3>
            <p>Redirigiendo al inicio de sesión...</p>
          </div>
        </div>
      )}

      <form className="admin-firstuse-form" onSubmit={handleFormSubmit}>
        <div className="admin-firstuse-section">
          <h3 className="admin-firstuse-section-title">
            <FaUser className="section-icon" /> Información Personal
          </h3>
          
          <div className="admin-firstuse-form-row">
            <div className="admin-firstuse-form-group">
              <label htmlFor="firstName" className="admin-firstuse-label">
                <FaUser /> Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur('firstName')}
                className={`admin-firstuse-input ${touchedFields.firstName && !formData.firstName ? 'input-error' : ''}`}
                placeholder="Ingresa tu nombre"
                required
                disabled={success}
              />
              {touchedFields.firstName && !formData.firstName && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>

            <div className="admin-firstuse-form-group">
              <label htmlFor="lastName" className="admin-firstuse-label">
                <FaUser /> Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur('lastName')}
                className={`admin-firstuse-input ${touchedFields.lastName && !formData.lastName ? 'input-error' : ''}`}
                placeholder="Ingresa tu apellido"
                required
                disabled={success}
              />
              {touchedFields.lastName && !formData.lastName && (
                <span className="error-message">Este campo es requerido</span>
              )}
            </div>
          </div>

          <div className="admin-firstuse-form-row">
            <div className="admin-firstuse-form-group">
              <label htmlFor="dateOfBirth" className="admin-firstuse-label">
                <FaCalendarAlt /> Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={() => handleBlur('dateOfBirth')}
                className={`admin-firstuse-input ${touchedFields.dateOfBirth && !formData.dateOfBirth ? 'input-error' : ''}`}
                required
                disabled={success}
              />
              {touchedFields.dateOfBirth && !formData.dateOfBirth && (
                <span className="error-message">Seleccione una fecha</span>
              )}
            </div>

            <div className="admin-firstuse-form-group">
              <label htmlFor="employeeDui" className="admin-firstuse-label">
                <FaIdCard /> DUI *
              </label>
              <input
                type="text"
                id="employeeDui"
                name="employeeDui"
                value={formData.employeeDui}
                onChange={handleDuiChange}
                onBlur={() => handleBlur('employeeDui')}
                className={`admin-firstuse-input ${touchedFields.employeeDui && !formData.employeeDui ? 'input-error' : ''}`}
                placeholder="00000000-0"
                maxLength="10"
                pattern="[0-9]{8}-[0-9]{1}"
                required
                disabled={success}
              />
              {touchedFields.employeeDui && !formData.employeeDui && (
                <span className="error-message">Formato: 8 dígitos, guión y 1 dígito</span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-firstuse-section">
          <h3 className="admin-firstuse-section-title">
            <FaLock className="section-icon" /> Credenciales de Acceso
          </h3>
          
          <div className="admin-firstuse-form-row">
            <div className="admin-firstuse-form-group">
              <label htmlFor="email" className="admin-firstuse-label">
                <FaEnvelope /> Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`admin-firstuse-input ${touchedFields.email && !formData.email ? 'input-error' : ''}`}
                placeholder="ejemplo@correo.com"
                required
                disabled={success}
              />
              {touchedFields.email && !formData.email && (
                <span className="error-message">Ingrese un email válido</span>
              )}
            </div>

            <div className="admin-firstuse-form-group">
              <label htmlFor="password" className="admin-firstuse-label">
                <FaLock /> Contraseña *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className={`admin-firstuse-input ${touchedFields.password && !formData.password ? 'input-error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  minLength="6"
                  required
                  disabled={success}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  disabled={success}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touchedFields.password && !formData.password && (
                <span className="error-message">Mínimo 6 caracteres</span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-firstuse-section">
          <h3 className="admin-firstuse-section-title">
            <FaDollarSign className="section-icon" /> Información Laboral
          </h3>
          
          <div className="admin-firstuse-form-row">
            <div className="admin-firstuse-form-group">
              <label htmlFor="salary" className="admin-firstuse-label">
                <FaDollarSign /> Salario *
              </label>
              <div className="salary-input-container">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  onBlur={() => handleBlur('salary')}
                  className={`admin-firstuse-input ${touchedFields.salary && !formData.salary ? 'input-error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  disabled={success}
                />
              </div>
              {touchedFields.salary && !formData.salary && (
                <span className="error-message">Ingrese un valor válido</span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-firstuse-section">
          <h3 className="admin-firstuse-section-title">
            <FaHome className="section-icon" /> Dirección
          </h3>
          
          <div className="admin-firstuse-form-group full-width">
            <label htmlFor="address" className="admin-firstuse-label">
              <FaHome /> Dirección Completa *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              className={`admin-firstuse-input ${touchedFields.address && !formData.address ? 'input-error' : ''}`}
              placeholder="Calle, número, ciudad, departamento"
              required
              disabled={success}
            />
            {touchedFields.address && !formData.address && (
              <span className="error-message">Este campo es requerido</span>
            )}
          </div>
        </div>

        <div className="admin-firstuse-form-actions">
          <button 
            type="submit" 
            className="admin-firstuse-btn-primary"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirstUse;