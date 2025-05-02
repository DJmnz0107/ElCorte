// Importación de React
import React from 'react';
// Importación del archivo CSS correspondiente
import '../css/register.css';

// Componente funcional SignUp (formulario de registro)
const SignUp = () => {
  return (
    <div className="signup-container">
      
      {/* Sección principal del formulario de registro */}
      <div className="signup-form-section">
        <div className="signup-form-wrapper">
          
          {/* Título principal con emoji */}
          <h1 className="signup-title">Únete al goce <span className="emoji">🍴</span></h1>
          
          {/* Formulario de registro */}
          <form className="signup-form">

            {/* Grupo para nombre y apellido */}
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

            {/* Campo de correo electrónico */}
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="usuario@ejemplo.com"
                className="form-input"
              />
            </div>

            {/* Campo de contraseña con botón para mostrarla (funcionalidad no implementada aún) */}
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

            {/* Campo de fecha de nacimiento */}
            <div className="form-group date-group">
              <label htmlFor="birthdate">Fecha de Nacimiento</label>
              <input
                type="date"
                id="birthdate"
                className="date-input"
              />
            </div>

            {/* Botón de envío del formulario */}
            <button type="submit" className="submit-button">
              Registrarse
            </button>

            {/* Separador visual */}
            <div className="divider">
              <span>o</span>
            </div>

            {/* Botón para registrarse con Google */}
            <button type="button" className="google-button">
              <img 
                src="https://www.svgrepo.com/show/475656/google-color.svg" 
                alt="Google" 
                className="google-icon"
              />
              Continuar con Google
            </button>

            {/* Enlace para usuarios ya registrados */}
            <p className="existing-account">
              ¿Tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </p>
          </form>
        </div>
      </div>
      
      {/* Sección lateral derecha para posible imagen o contenido promocional */}
      <div className="signup-banner">
        <div className="banner-content">
          {/* Puedes añadir aquí una imagen, texto o branding */}
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default SignUp;
