import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, ShoppingBag, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import elcorteLogo from './elcorte.png';
import './Navbar.css';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
    setShowSearch(false);
  };

  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!document.querySelector('.dropdown-container:hover')) {
        setActiveDropdown(null);
      }
    }, 200);
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

      {/* Menú con dropdowns */}
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Inicio</Link>
        
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
            <Link to="/terminos" className="dropdown-item">Términos y Condiciones</Link>
            <Link to="/garantias" className="dropdown-item">Política de Garantías</Link>
            <Link to="/envios" className="dropdown-item">Envíos y Devoluciones</Link>
          </div>
        </div>
        
        <Link to="/noticias" className="navbar-item">Noticias</Link>
        
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
            <Link to="/contacto" className="dropdown-item">Contacto</Link>
            <Link to="/preguntas" className="dropdown-item">Preguntas Frecuentes</Link>
            <Link to="/blog" className="dropdown-item">Blog</Link>
          </div>
        </div>
        
        <Link to="/about-us" className="navbar-item">Sobre Nosotros</Link>
      </div>

      {/* Acciones del usuario */}
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
    </nav>
  );
};

export default Navbar;