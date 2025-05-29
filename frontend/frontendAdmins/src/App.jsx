import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from 'react-hot-toast';

import SignIn from './pages/SignIn';
import RecoveryPassword from './pages/RecoveryPassword';
import VerifyCode from './pages/VerifyCode';
import ChangePassword from './pages/ChangePassword';
import FirstUse from './pages/FirstUse';
import Dashboard from "./pages/Dashboard";
import Sidebar from './components/SideNavBar';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import './App.css';

function App() {
  const [checking, setChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false); // Cambiado a false por defecto

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/employees/existe-admin");
        const data = await res.json();
        setAdminExists(data.existeAdmin);
      } catch (err) {
        console.error("Error al verificar admin:", err);
        setAdminExists(true); // Por seguridad, asumir que sí hay si hay error
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
        
        {/* Solo muestra login si ya existe admin */}
        <Route path="/login" element={adminExists ? <SignIn /> : <Navigate to="/first-use" />} />
        
        <Route path="/forgot-password" element={<RecoveryPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Solo muestra first-use si no hay admin */}
        <Route path="/first-use" element={!adminExists ? <FirstUse /> : <Navigate to="/login" />} />

        <Route path="/dashboard" element={
          
           <>
    <Sidebar/>
    <Dashboard />
  </>} 
/>
        <Route path="/proveedores" element={
          <>
            <Sidebar />
            <Suppliers />
          </>
        } />

        <Route path="/productos" element={
          <>
            <Sidebar />
            <Products />
          </>
        } />
        
        {/* Redirige a /dashboard si no hay ruta coincidente */}
        <Route path="*" element={<Navigate to="/dashboard" />}/>
      </Routes>
    </>
  );
}

export default App;