import React from 'react';
import { Link } from 'react-router-dom';
import '../css/signin.css'; // Archivo CSS separado

const Login = () => {
  return (
    <div className="login-container">
      {/* Sección del formulario - Más arriba y a la izquierda */}
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="login-title">Bienvenido</h1>
          
          <form className="form">
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
                  placeholder="••••••••••••••••"
                  className="form-input password-long"
                />
                <button type="button" className="show-password">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Recordar sesión</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            <button type="submit" className="submit-button">
              Ingresar
            </button>
            
            <div className="divider">
              <span>o continuar con</span>
            </div>
            
    
            
            <div className="register-link">
              ¿No tienes una cuenta? <Link to="/signup">Regístrate aquí</Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Sección del banner */}
      <div className="login-banner-section">
        <div className="login-banner">
          <div className="banner-content">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;