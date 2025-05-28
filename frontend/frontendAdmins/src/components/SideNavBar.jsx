import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdStore,
  MdPerson,
  MdShoppingCart,
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';
import '../css/sidebar.css';
import elCorteLogo from '../assets/elCorte.png'; 

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: MdDashboard,
      path: '/dashboard'
    },
    {
      id: 'empleados',
      label: 'Empleados',
      icon: MdPeople,
      path: '/empleados'
    },
    {
      id: 'proveedores',
      label: 'Proveedores',
      icon: MdStore,
      path: '/proveedores'
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: MdPerson,
      path: '/clientes'
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: MdShoppingCart,
      path: '/productos'
    }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      localStorage.removeItem('token');
      setShowLogoutModal(false);
      toast.success('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
      console.error('Logout error:', error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      )}

      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <img src={elCorteLogo} alt="El Corte Logo" className="logo-image" />
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={handleNavClick}
                  >
                    <IconComponent className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogoutClick}>
            <MdLogout className="nav-icon" />
            <span className="nav-label">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="logout-modal">
            <h3>¿Estás seguro de cerrar sesión?</h3>
            <div className="modal-buttons">
              <button 
                className="modal-btn confirm-btn"
                onClick={handleLogout}
              >
                Sí, cerrar sesión
              </button>
              <button 
                className="modal-btn cancel-btn"
                onClick={cancelLogout}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;