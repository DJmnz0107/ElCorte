import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar el contexto
import useDataLogin from '../components/Login/hooks/useDataLoginInterface';
import '../css/signin.css';
import { Toaster, toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    errorLogin,
    loading,
    user,
  } = useDataLogin();

  const { login } = useAuth(); // Usar el contexto de autenticación
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const loggedUser = await handleLogin();
    console.log('loggedUser:', loggedUser);

    if (loggedUser) {
      const role = loggedUser.role.toLowerCase();

      if (loggedUser.userType === 'client') {
        toast.error('Los clientes no pueden iniciar sesión desde aquí.');
      } else if (loggedUser.userType === 'employee') {
        if (role === 'admin' || role === 'employee') {
          // Preparar datos del usuario para el contexto
          const userData = {
            id: loggedUser.id,
            name: loggedUser.name || loggedUser.email,
            email: loggedUser.email,
            role: role === 'admin' ? 'Admin' : 'Employee', // Normalizar el rol
            userType: loggedUser.userType
          };

          // Obtener el token (asumiendo que viene en la respuesta)
          const token = loggedUser.token || localStorage.getItem('token');

          // Usar el contexto para guardar el estado del usuario
          login(userData, token);

          toast.success('Inicio de sesión exitoso.');
          navigate('/dashboard');
        } else {
          toast.error('Rol no reconocido.');
        }
      } else {
        toast.error('Tipo de usuario no válido.');
      }
    } else {
      toast.error('Usuario o contraseña incorrectos.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <Toaster position="top-right" />
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="login-title">Bienvenido</h1>

          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="usuario@ejemplo.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••••••"
                  className="form-input password-long"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="show-password"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            {errorLogin && <p style={{ color: 'red' }}>{errorLogin}</p>}

            <div className="divider">
              <span>o continuar con</span>
            </div>

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
  );
};

export default Login;