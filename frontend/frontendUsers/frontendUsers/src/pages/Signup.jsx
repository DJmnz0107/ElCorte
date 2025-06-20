import React, { useState } from 'react';
import '../css/register.css';
import useAddCustomer from '../components/hooks/useDataCustomers';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: ''
  });

  const { addCustomer, loading, error } = useAddCustomer();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCustomer = await addCustomer(formData);
      alert(`¡Registro exitoso, ${newCustomer.firstName}!`);
      // Redirigir al login o dashboard
      window.location.href = '/login';
    } catch (err) {
      // El error ya está manejado por el hook
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-section">
        <div className="signup-form-wrapper">
          <h1 className="signup-title">Únete al goce <span className="emoji">🍴</span></h1>
          
          {error && <div className="error-message">{error}</div>}

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Tu nombre"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Tu apellido"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="usuario@ejemplo.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input">
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <button type="button" className="show-password">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-group date-group">
              <label htmlFor="dateOfBirth">Fecha de Nacimiento</label>
              <input
                type="date"
                id="dateOfBirth"
                className="date-input"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="divider">
              <span>o</span>
            </div>

            <button type="button" className="google-button">
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="google-icon"
              />
              Continuar con Google
            </button>

            <p className="existing-account">
              ¿Tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
          </form>
        </div>
      </div>
      
      <div className="signup-banner">
        <div className="banner-content">
          {/* Contenido promocional */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;