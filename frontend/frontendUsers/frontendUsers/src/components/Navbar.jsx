import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import elcorteLogo from './elcorte.png';
import './Navbar.css';

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={elcorteLogo} alt="El Corté" className="logo-image" />
        </Link>
      </div>

      {/* Menú simple */}
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Inicio</Link>
        <Link to="/tienda" className="navbar-item">Tienda</Link>
        <Link to="/noticias" className="navbar-item">Noticias</Link>
        <Link to="/mas" className="navbar-item">Más</Link>
        <Link to="/sobre-nosotros" className="navbar-item">Sobre Nosotros</Link>
      </div>

      {/* Acciones */}
      <div className="navbar-actions">
        <div className={`navbar-search ${showSearch ? 'expanded' : ''}`} ref={searchRef}>
          <button 
            className="search-button"
            onClick={() => setShowSearch(!showSearch)}
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