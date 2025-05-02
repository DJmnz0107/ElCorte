import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import elcorteLogo from '../assets/elCorte.png';
import './Navbar.css';

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

  return (
    <nav className="navbar">
      {/* Contenedor del logo con tamaño controlado */}
      <div className="navbar-logo-container">
        <Link to="/">
          <img 
            src={elcorteLogo}
            alt="El Corté" 
            className="navbar-logo-image"
          />
        </Link>
      </div>

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

      {/* Menú con dropdowns - Versión desktop */}
      <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="mobile-menu-header">
        </div>
        
        <Link to="/" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
        
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
            <Link to="/tienda" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>Productos</Link>
            <Link to="/TermsAndConditions" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>Términos y Condiciones</Link>
          </div>
        </div>
        
        <Link to="/News" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>Noticias</Link>
        
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
            <Link to="/contact" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>

          </div>
        </div>
        
        <Link to="/about-us" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>Sobre Nosotros</Link>
        
        {/* Mobile-only user actions */}
        <div className="mobile-menu-actions">
          <Link to="/login" className="mobile-navbar-login" onClick={() => setMobileMenuOpen(false)}>
            Iniciar Sesión
          </Link>
          <div className="mobile-search-container">
            <input type="text" placeholder="Buscar..." className="mobile-search-input" />
            <Search size={20} className="mobile-search-icon" />
          </div>
        </div>
      </div>

      {/* Acciones del usuario - Versión desktop */}
      <div className="navbar-actions">
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
        
        <div className="navbar-cart">
          <ShoppingBag size={20} />
          <span className="cart-badge">8</span>
        </div>
        
        <Globe size={20} className="navbar-globe" />
      </div>
      
      {/* Overlay para el menú móvil */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default Navbar;