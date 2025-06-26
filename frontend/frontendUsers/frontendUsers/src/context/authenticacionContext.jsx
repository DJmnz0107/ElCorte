import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar token mejorada
  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:4000/api/login/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // Normaliza los campos de ID
          const userData = {
            ...data.user,
            _id: data.user._id || data.user.id
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token inválido o datos incompletos
          handleAuthError();
        }
      } else {
        // Error en la respuesta (401, 403, etc.)
        handleAuthError();
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      handleAuthError();
    } finally {
      setLoading(false);
    }
  };

  // Función helper para manejar errores de autenticación
  const handleAuthError = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para login mejorada
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        // Guarda el token en localStorage
        localStorage.setItem('authToken', data.token);
        
        // Normaliza los campos de ID
        const userData = {
          ...data.user,
          _id: data.user._id || data.user.id
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        return data;
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar datos del usuario
  const updateUser = (userData) => {
    const normalizedUser = {
      ...userData,
      _id: userData._id || userData.id
    };
    setUser(normalizedUser);
  };

  // Verificar token al cargar la aplicación
  useEffect(() => {
    verifyToken();
  }, []);

  // Listener para detectar cambios en localStorage (útil para múltiples pestañas)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        if (e.newValue === null) {
          // Token removido en otra pestaña
          setUser(null);
          setIsAuthenticated(false);
        } else if (e.newValue && !isAuthenticated) {
          // Token añadido en otra pestaña
          verifyToken();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    verifyToken,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};