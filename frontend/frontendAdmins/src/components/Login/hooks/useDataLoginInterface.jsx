// En tu hook useDataLoginInterface.js (ejemplo básico)
import { useState } from 'react';

const useDataLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorLogin, setErrorLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  setErrorLogin(null);
  try {
    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Usuario o contraseña incorrectos.');

    const data = await response.json();
    setUser(data.user);  // Asumiendo que backend envía { user: {...} }
    setLoading(false);
    return data.user;
  } catch (error) {
    setErrorLogin(error.message);
    setUser(null);
    setLoading(false);
    return null;
  }
};


  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    errorLogin,
    loading,
    user,
  };
};

export default useDataLogin;
