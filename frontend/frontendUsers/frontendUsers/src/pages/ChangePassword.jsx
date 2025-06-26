import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useRecoveryPassword from '../components/hooks/useRecoveryPassword';
import '../css/changepassword.css';

const CambiarContrasena = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const { loading, setNewPassword } = useRecoveryPassword();
  const navigate = useNavigate();

  const togglePassword1 = () => setShowPassword1(!showPassword1);
  const togglePassword2 = () => setShowPassword2(!showPassword2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor, completa ambos campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const success = await setNewPassword(password);
    if (success) {
      navigate('/'); // Regresa al login
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="password-change-title">Cambia tu contraseña</h1>

          <form className="form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword1 ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={togglePassword1}
                  tabIndex={-1}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  id="confirm-password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={togglePassword2}
                  tabIndex={-1}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" />
                    <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="buttons-container">
              <Link to="/" className="cancel-link">
                <button type="button" className="cancel-button" disabled={loading}>
                  Regresar al login
                </button>
              </Link>

              <button
                type="submit"
                className="submit-button change-password-button"
                disabled={loading}
              >
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </div>
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

export default CambiarContrasena;
