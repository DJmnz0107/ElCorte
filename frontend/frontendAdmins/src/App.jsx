import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/ProtectedRoutes';

import SignIn from './pages/SignIn';
import RecoveryPassword from './pages/RecoveryPassword';
import VerifyCode from './pages/VerifyCode';
import ChangePassword from './pages/ChangePassword';
import FirstUse from './pages/FirstUse';
import Dashboard from "./pages/Dashboard";
import Sidebar from './components/SideNavBar';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Employees from "./pages/Employees";
import Customers from "./pages/Customers";
import './App.css';

function AppContent() {
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/employees/existe-admin");
        const data = await res.json();
        setAdminExists(data.existeAdmin);
      } catch (err) {
        console.error("Error al verificar admin:", err);
        setAdminExists(true);
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, []);

  if (checking) return <p>Cargando...</p>;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Redirige a /first-use si no hay admin, o a /login si sí existe */}
        <Route path="/" element={adminExists ? <Navigate to="/login" /> : <Navigate to="/first-use" />} />
        
        {/* Rutas públicas (no requieren autenticación) */}
        <Route path="/login" element={
          <PublicRoute>
            {adminExists ? <SignIn /> : <Navigate to="/first-use" />}
          </PublicRoute>
        } />
        
        <Route path="/forgot-password" element={
          <PublicRoute>
            <RecoveryPassword />
          </PublicRoute>
        } />
        
        <Route path="/verify-code" element={
          <PublicRoute>
            <VerifyCode />
          </PublicRoute>
        } />
        
        <Route path="/change-password" element={
          <PublicRoute>
            <ChangePassword />
          </PublicRoute>
        } />
        
        <Route path="/first-use" element={
          <PublicRoute>
            {!adminExists ? <FirstUse /> : <Navigate to="/login" />}
          </PublicRoute>
        } />

        {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Sidebar />
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/proveedores" element={
          <ProtectedRoute>
            <Sidebar />
            <Suppliers />
          </ProtectedRoute>
        } />

        <Route path="/productos" element={
          <ProtectedRoute>
            <Sidebar />
            <Products />
          </ProtectedRoute>
        } />

         {/* Rutas protegidas (requieren autenticación) */}
        <Route path="/clientes" element={
          <ProtectedRoute>
            <Sidebar />
            <Customers />
          </ProtectedRoute>
        } />


        {/* Ruta solo para Admin */}
        <Route path="/empleados" element={
          <AdminRoute>
            <Sidebar />
            <Employees />
          </AdminRoute>
        } />

        {/* Redirige a /dashboard si no hay ruta coincidente */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;