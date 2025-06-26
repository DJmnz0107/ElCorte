import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authenticacionContext';
import '../css/login.css';

// Toast Component
const Toast = ({ type, message, onClose, visible }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'toast toast-success';
      case 'error':
        return 'toast toast-error';
      case 'info':
        return 'toast toast-info';
      default:
        return 'toast';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

// Hook personalizado para toast
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message, visible: true }]);
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, hideToast } = useToast();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones adicionales con toast
    if (!formData.email.trim()) {
      showToast('error', 'Por favor ingresa tu correo electrónico');
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      showToast('error', 'Por favor ingresa tu contraseña');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showToast('error', 'La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      showToast('info', 'Verificando credenciales...');
      const data = await login(formData.email, formData.password);
      
      // Reemplazar el alert con toast
      showToast('success', `¡Bienvenido de vuelta, ${data.user.name}!`);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err) {
      const errorMessage = err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    showToast('info', 'Conectando con Google...');
    // Aquí iría tu lógica de Google OAuth
  };

  const handleForgotPassword = () => {
    showToast('info', 'Te redirigiremos para recuperar tu contraseña');
  };

  return (
    <>
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            visible={toast.visible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>

      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form">
            <h1 className="login-title">Iniciar sesión</h1>

            {error && <div className="error-message">{error}</div>}

            <form className="form" onSubmit={handleSubmit}>
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
                  disabled={loading}
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button type="button" className="show-password" disabled={loading}>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M12 5c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                      <path d="M12 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" disabled={loading} />
                  <label htmlFor="remember">Recordar sesión</label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="forgot-password"
                  onClick={() => handleForgotPassword()}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>

              <div className="divider">
                <span>o continuar con</span>
              </div>

              <button 
                type="button" 
                className="google-button" 
                disabled={loading}
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="google-icon"
                />
                Continuar con Google
              </button>

              <div className="register-link">
                ¿No tienes una cuenta? <Link to="/signup">Regístrate aquí</Link>
              </div>
            </form>
          </div>
        </div>

        <div className="login-banner-section">
          <div className="login-banner">
            <div className="banner-content"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;