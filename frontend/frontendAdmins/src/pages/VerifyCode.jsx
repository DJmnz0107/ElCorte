import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/verifycode.css';

const VerificarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const codigoValido = '123456'; // Código de ejemplo para validar

  const handleSubmit = (e) => {
    e.preventDefault();

    if (codigo.trim() === '') {
      setError('Por favor ingresa el código.');
      return;
    }

    if (codigo === codigoValido) {
      setError('');
      // Redirigir a la página de recuperación de contraseña
      navigate('/recuperar-contraseña');
    } else {
      setError('Código incorrecto. Intenta nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="verification-title">
            Ingresa tu código de recuperación
          </h1>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="verification-code"
                className="form-input verification-input"
                placeholder="Código de 6 dígitos"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            {error && <p style={{color: 'red', fontSize: '14px', marginTop: '-15px', marginBottom: '10px'}}>{error}</p>}

            <Link to="/ChangePassword" className="verify-link">
            <button type="submit" className="submit-button verification-button">
              Verificar
            </button>
            </Link>
          </form>
        </div>
      </div>

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

export default VerificarCodigo;
