import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import elcorteLogo from '../assets/elCorte.png';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const dropdownRefs = {
    tienda: useRef(null),
    mas: useRef(null)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
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
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

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
            <Link to="/login" className="mobile-navbar-login" onClick={closeMobileMenu}>Iniciar Sesión</Link>
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
              }}
            >
              <Search size={20} />
            </button>
            {showSearch && (
              <input type="text" placeholder="Buscar..." className="search-input" autoFocus />
            )}
          </div>
          <Link to="/login" className="navbar-login">Iniciar Sesión</Link>
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