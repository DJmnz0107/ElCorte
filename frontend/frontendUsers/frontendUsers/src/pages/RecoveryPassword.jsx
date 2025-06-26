import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRecoveryPassword from '../components/hooks/useRecoveryPassword';
import '../css/recoverypassword.css';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const { loading, requestRecoveryCode } = useRecoveryPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    await requestRecoveryCode(email);
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form">
          <div className="login-title-container">
            <div className="icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                  fill="#5C0A05"
                />
              </svg>
            </div>
            <div>
              <h1 className="login-title">Recuperar Contraseña</h1>
              <p className="login-subtitle">Ingresa tu Correo Electrónico</p>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <Link to="/verify-code" className="verify-link">
  <button type="button" className="verify-button">
    Verificar código
  </button>
</Link>
          </form>
        </div>
      </div>

      <div className="login-banner-section">
        <div className="login-banner">
          <div className="banner-content">{/* Contenido opcional */}</div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
