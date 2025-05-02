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
          setActiveDropdown(prev => prev === key ? null : prev);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Prevenir scroll cuando el menú móvil está abierto
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
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
    setMobileMenuOpen(!mobileMenuOpen);
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
        {/* Logo a la izquierda */}
        <div className="navbar-section navbar-logo-section">
          <Link to="/" className="navbar-logo-container">
            <img 
              src={elcorteLogo}
              alt="El Corté" 
              className="navbar-logo-image"
            />
          </Link>
          
          {/* Hamburger Menu Icon for Mobile */}
          <div className="mobile-menu-toggle">
            <button 
              className="menu-toggle-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú con dropdowns - Centrado */}
        <div className={`navbar-section navbar-menu-section ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-menu-header">
          </div>
          
          <div className="navbar-menu">
            <Link to="/" className="navbar-item" onClick={closeMobileMenu}>Inicio</Link>
            
            {/* Dropdown de Tienda */}
            <div 
              className="dropdown-container" 
              ref={dropdownRefs.tienda}
              onMouseEnter={() => handleMouseEnter('tienda')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="navbar-item dropdown-toggle"
                onClick={() => toggleDropdown('tienda')}
              >
                Tienda <ChevronDown size={18} className={`dropdown-icon ${activeDropdown === 'tienda' ? 'rotate' : ''}`} />
              </button>
              
              <div className={`dropdown-menu ${activeDropdown === 'tienda' ? 'show' : ''}`}>
                <Link to="/tienda" className="dropdown-item" onClick={closeMobileMenu}>Productos</Link>
                <Link to="/TermsAndConditions" className="dropdown-item" onClick={closeMobileMenu}>Términos y Condiciones</Link>
              </div>
            </div>
            
            <Link to="/News" className="navbar-item" onClick={closeMobileMenu}>Noticias</Link>
            
            {/* Dropdown de Más */}
            <div 
              className="dropdown-container" 
              ref={dropdownRefs.mas}
              onMouseEnter={() => handleMouseEnter('mas')}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="navbar-item dropdown-toggle"
                onClick={() => toggleDropdown('mas')}
              >
                Más <ChevronDown size={18} className={`dropdown-icon ${activeDropdown === 'mas' ? 'rotate' : ''}`} />
              </button>
              
              <div className={`dropdown-menu ${activeDropdown === 'mas' ? 'show' : ''}`}>
                <Link to="/contact" className="dropdown-item" onClick={closeMobileMenu}>Contacto</Link>
              </div>
            </div>
            
            <Link to="/about-us" className="navbar-item" onClick={closeMobileMenu}>Sobre Nosotros</Link>
          </div>
          
          {/* Mobile-only user actions */}
          <div className="mobile-menu-actions">
            <Link to="/login" className="mobile-navbar-login" onClick={closeMobileMenu}>
              Iniciar Sesión
            </Link>
            <div className="mobile-search-container">
              <input type="text" placeholder="Buscar..." className="mobile-search-input" />
              <Search size={20} className="mobile-search-icon" />
            </div>
            <div className="mobile-cart-container" onClick={closeMobileMenu}>
              <Link to="/cart" className="mobile-cart-link">
                <ShoppingBag size={20} />
                <span className="cart-badge">8</span>
                <span className="mobile-cart-text">Mi Carrito</span>
              </Link>
            </div>
            <div className="mobile-language-selector">
              <Globe size={20} className="mobile-globe-icon" />
              <span>Seleccionar idioma</span>
            </div>
          </div>
        </div>

        {/* Acciones del usuario - A la derecha */}
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
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="search-input"
                autoFocus
              />
            )}
          </div>
          
          <Link to="/login" className="navbar-login">Iniciar Sesión</Link>
          
          <Link to="/cart" className="navbar-cart">
            <ShoppingBag size={20} />
            <span className="cart-badge">8</span>
          </Link>
          
          <button className="navbar-language-button">
            <Globe size={20} className="navbar-globe" />
          </button>
        </div>
      </div>
      
      {/* Overlay para el menú móvil */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default Navbar;