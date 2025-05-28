// components/SideNavBar.jsx - Versión completamente responsive
import React, { useState, useEffect } from 'react';
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

  // Detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false); // Cerrar sidebar en desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Cerrar sidebar al hacer clic en un enlace en móvil
  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Alternar sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      {isMobile && (
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
      )}

      {/* Overlay para móvil */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
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
          <button className="logout-btn" onClick={handleLogout}>
            <MdLogout className="nav-icon" />
            <span className="nav-label">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;