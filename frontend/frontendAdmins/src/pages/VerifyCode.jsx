import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRecoveryPassword from '../components/RecoveryPassword/Hooks/useRecoveryPassword';
import '../css/verifycode.css';

const VerificarCodigo = () => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const { verifyRecoveryCode, loading } = useRecoveryPassword();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (codigo.trim() === '') {
      setError('Por favor ingresa el código.');
      return;
    }

    const isValid = await verifyRecoveryCode(codigo);
    if (isValid) {
      navigate('/change-password');

    } else {
      setError('Código incorrecto o expirado.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form">
          <h1 className="verification-title">Ingresa tu código de recuperación</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="verification-code"
                className="form-input verification-input"
                placeholder="Código de 5 dígitos"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

            <button
              type="submit"
              className="submit-button verification-button"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-banner-section">
        <div className="login-banner">
          <div className="banner-content">{/* Banner opcional */}</div>
        </div>
      </div>
    </div>
  );
};

export default VerificarCodigo;
