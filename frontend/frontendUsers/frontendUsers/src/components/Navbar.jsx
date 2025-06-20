import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Globe, Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authenticacionContext';
import './Navbar.css';
import elcorteLogo from '../assets/elCorte.png';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, isAuthenticated, logout, loading } = useAuth();
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const dropdownRefs = {
    tienda: useRef(null),
    mas: useRef(null)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      Object.entries(dropdownRefs).forEach(([key, ref]) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setActiveDropdown((prev) => (prev === key ? null : prev));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    setShowSearch(false);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    setShowSearch(false);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (dropdownName) => {
    if (window.innerWidth > 768) {
      setActiveDropdown(dropdownName);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setTimeout(() => {
        if (!document.querySelector('.dropdown-container:hover')) {
          setActiveDropdown(null);
        }
      }, 200);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setShowSearch(false);
    setActiveDropdown(null);
    setShowUserMenu(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    closeMobileMenu();
  };

  // Componente para el menú de usuario
  const UserMenu = () => (
    <div className={`user-dropdown-menu ${showUserMenu ? 'show' : ''}`}>
      <div className="user-info">
        <div className="user-avatar">
          <User size={20} />
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name}</span>
          <span className="user-email">{user?.email}</span>
          <span className="user-role">{user?.userType === 'employee' ? 'Empleado' : 'Cliente'}</span>
        </div>
      </div>
      <div className="user-menu-divider"></div>
      <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
        <User size={16} />
        Mi Perfil
      </Link>
      {user?.userType === 'client' && (
        <Link to="/orders" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
          <ShoppingBag size={16} />
          Mis Pedidos
        </Link>
      )}
      {user?.userType === 'employee' && (
        <Link to="/admin" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
          <User size={16} />
          Panel Admin
        </Link>
      )}
      <div className="user-menu-divider"></div>
      <button className="user-menu-item logout-item" onClick={handleLogout}>
        <LogOut size={16} />
        Cerrar Sesión
      </button>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo y botón hamburguesa */}
        <div className="navbar-section navbar-logo-section">
          <Link to="/" className="navbar-logo-container">
            <img src={elcorteLogo} alt="El Corté" className="navbar-logo-image" />
          </Link>
          <div className="mobile-menu-toggle">
            <button className="menu-toggle-button" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú principal */}
        <div className={`navbar-section navbar-menu-section ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {/* Cabecera del menú móvil */}
          <div className="mobile-menu-header">
          </div>

          <div className="navbar-menu">
            <Link to="/" className="navbar-item" onClick={closeMobileMenu}>Inicio</Link>

            {/* Dropdown Tienda */}
            <div
              className="dropdown-container"
              ref={dropdownRefs.tienda}
              onMouseEnter={() => handleMouseEnter('tienda')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="navbar-item dropdown-toggle" onClick={() => toggleDropdown('tienda')}>
                Tienda <ChevronDown size={18} className={`dropdown-icon ${activeDropdown === 'tienda' ? 'rotate' : ''}`} />
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'tienda' ? 'show' : ''}`}>
                <Link to="/tienda" className="dropdown-item" onClick={closeMobileMenu}>Productos</Link>
                <Link to="/TermsAndConditions" className="dropdown-item" onClick={closeMobileMenu}>Términos y Condiciones</Link>
                <Link to="/envios" className="dropdown-item" onClick={closeMobileMenu}>Envíos y Devoluciones</Link>
              </div>
            </div>

            <Link to="/News" className="navbar-item" onClick={closeMobileMenu}>Noticias</Link>

            {/* Dropdown Más */}
            <div
              className="dropdown-container"
              ref={dropdownRefs.mas}
              onMouseEnter={() => handleMouseEnter('mas')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="navbar-item dropdown-toggle" onClick={() => toggleDropdown('mas')}>
                Más <ChevronDown size={18} className={`dropdown-icon ${activeDropdown === 'mas' ? 'rotate' : ''}`} />
              </button>
              <div className={`dropdown-menu ${activeDropdown === 'mas' ? 'show' : ''}`}>
                <Link to="/ContactUs" className="dropdown-item" onClick={closeMobileMenu}>Contacto</Link>
                <Link to="/preguntas" className="dropdown-item" onClick={closeMobileMenu}>Preguntas Frecuentes</Link>
                <Link to="/blog" className="dropdown-item" onClick={closeMobileMenu}>Blog</Link>
              </div>
            </div>

            <Link to="/about-us" className="navbar-item" onClick={closeMobileMenu}>Sobre Nosotros</Link>
          </div>

          {/* Acciones extra en móvil */}
          <div className="mobile-menu-actions">
            {!loading && (
              isAuthenticated ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <User size={20} />
                    <span>{user?.name}</span>
                  </div>
                  <Link to="/profile" className="mobile-menu-link" onClick={closeMobileMenu}>Mi Perfil</Link>
                  {user?.userType === 'client' && (
                    <Link to="/orders" className="mobile-menu-link" onClick={closeMobileMenu}>Mis Pedidos</Link>
                  )}
                  {user?.userType === 'employee' && (
                    <Link to="/admin" className="mobile-menu-link" onClick={closeMobileMenu}>Panel Admin</Link>
                  )}
                  <button className="mobile-logout-button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link to="/login" className="mobile-navbar-login" onClick={closeMobileMenu}>Iniciar Sesión</Link>
              )
            )}
            
            <div className="mobile-search-container">
              <input type="text" placeholder="Buscar..." className="mobile-search-input" />
              <Search size={20} className="mobile-search-icon" />
            </div>
            <Link to="/cart" className="mobile-cart-link" onClick={closeMobileMenu}>
              <ShoppingBag size={20} />
              <span className="cart-badge">8</span>
              <span className="mobile-cart-text">Mi Carrito</span>
            </Link>
            <div className="mobile-language-selector">
              <Globe size={20} className="mobile-globe-icon" />
              <span>Seleccionar idioma</span>
            </div>
          </div>
        </div>

        {/* Acciones de usuario (desktop) */}
        <div className="navbar-section navbar-actions-section">
          <div className={`navbar-search ${showSearch ? 'expanded' : ''}`} ref={searchRef}>
            <button
              className="search-button"
              onClick={() => {
                setShowSearch(!showSearch);
                setActiveDropdown(null);
                setShowUserMenu(false);
              }}
            >
              <Search size={20} />
            </button>
            {showSearch && (
              <input type="text" placeholder="Buscar..." className="search-input" autoFocus />
            )}
          </div>
          
          {/* Botón de usuario/login */}
          {!loading && (
            isAuthenticated ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button className="navbar-user-button" onClick={toggleUserMenu}>
                  <User size={18} />
                  <span className="user-name-display">{user?.name}</span>
                  <ChevronDown size={16} className={`user-dropdown-icon ${showUserMenu ? 'rotate' : ''}`} />
                </button>
                <UserMenu />
              </div>
            ) : (
              <Link to="/login" className="navbar-login">Iniciar Sesión</Link>
            )
          )}
          
          <Link to="/cart" className="navbar-cart">
            <ShoppingBag size={20} />
            <span className="cart-badge">8</span>
          </Link>
          <button className="navbar-language-button">
            <Globe size={20} />
          </button>
        </div>
      </div>

      {/* Overlay para cerrar menú móvil */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default Navbar;