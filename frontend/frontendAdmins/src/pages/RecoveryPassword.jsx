import React from 'react';
import { Link } from 'react-router-dom';
import '../css/recoverypassword.css'; // Reutilizamos el mismo archivo CSS

const RecuperarContrasena = () => {
  return (
    <div className="login-container">
      {/* Sección del formulario - Adaptada para recuperar contraseña */}
      <div className="login-form-section">
        <div className="login-form">
          <div className="login-title-container">
            <div className="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#5C0A05"/>
              </svg>
            </div>
            <div>
              <h1 className="login-title">Recuperar Contraseña</h1>
              <p className="login-subtitle">Ingresa tu Correo Electrónico</p>
            </div>
          </div>
          
          <form className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
              />
            </div>
            
            <button type="submit" className="submit-button">
              Enviar Código
            </button>
            
            <Link to="/verifyCode" className="verify-link">
              <button type="button" className="verify-button">
                Verificar código
              </button>
            </Link>
          </form>
        </div>
      </div>
      
      {/* Sección del banner - Mantenemos el diseño original */}
      <div className="login-banner-section">
        <div className="login-banner">
          <div className="banner-content">
            {/* Contenido del banner si es necesario */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;