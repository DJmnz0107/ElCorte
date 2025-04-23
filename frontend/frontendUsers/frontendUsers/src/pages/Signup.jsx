import React from 'react';
import '../css/register.css';

const SignUp = () => {
  return (
    <div className="signup-container">
      {/* Sección del formulario - Posicionada más arriba */}
      <div className="signup-form-section">
        <div className="signup-form-wrapper">
          <h1 className="signup-title">Únete al goce <span className="emoji">🍴</span></h1>
          
          <form className="signup-form">
            <div className="name-row">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Tu nombre"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname">Apellido</label>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Tu apellido"
                  className="form-input"
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
              <label htmlFor="birthdate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthdate"
                className="date-input"
              />
            </div>
            
            <button type="submit" className="submit-button">
              Registrarse
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
            
            {/* Texto de cuenta existente ajustado */}
            <p className="existing-account">
              ¿Tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
          </form>
        </div>
      </div>
      
      {/* Banner lateral derecho */}
      <div className="signup-banner">
        <div className="banner-content">
      
        </div>
      </div>
    </div>
  );
};

export default SignUp;