import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/changepassword.css'; // Reutilizamos el archivo CSS base

const CambiarContrasena = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <div className="login-container">
      {/* Sección del formulario - Adaptada para cambiar contraseña */}
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="password-change-title">
            Cambia tu contraseña
          </h1>
          
          <form className="form">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword1 ? "text" : "password"}
                  id="password"
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="show-password"
                  onClick={togglePassword1}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword2 ? "text" : "password"}
                  id="confirm-password"
                  className="form-input"
                />
                <button 
                  type="button" 
                  className="show-password"
                  onClick={togglePassword2}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="buttons-container">
              <Link to="/" className="cancel-link">
                <button type="button" className="cancel-button">
                  Regresar al login
                </button>
              </Link>
              
              <button type="submit" className="submit-button change-password-button">
                Cambiar contraseña
              </button>
            </div>
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

export default CambiarContrasena;