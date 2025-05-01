import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [activeFooterSection, setActiveFooterSection] = useState(null);

  // Para activar secciones en versión móvil
  const toggleFooterSection = (sectionName) => {
    setActiveFooterSection(activeFooterSection === sectionName ? null : sectionName);
  };

  return (
    <footer className="footer">
      {/* Contenedor principal del footer */}
      <div className="footer-container">
        {/* Columna 1 - Logo y lema */}
        <div className="footer-col">
          <div className="footer-logo-container">
            <h2 className="footer-logo">El Corte<span className="meat-icon">🥩</span></h2>
          </div>
          <p className="footer-quote">
            "Calidad en cada corte, <br />
            sabor en cada plato."
          </p>
        </div>

        {/* Columna 2 - Links */}
        <div className="footer-col">
          <h3 
            className="footer-title" 
            onClick={() => toggleFooterSection('links')}
          >
            Links
          </h3>
          <ul className={`footer-links ${activeFooterSection === 'links' ? 'show-mobile' : ''}`}>
            <li><Link to="/sobre-nosotros" className="footer-link">Sobre Nosotros</Link></li>
            <li><Link to="/terminos" className="footer-link">Términos y Condiciones</Link></li>
            <li><Link to="/contacto" className="footer-link">Contáctanos</Link></li>
          </ul>
        </div>

        {/* Columna 3 - Main Menu */}
        <div className="footer-col">
          <h3 
            className="footer-title"
            onClick={() => toggleFooterSection('menu')}
          >
            Main Menu
          </h3>
          <ul className={`footer-links ${activeFooterSection === 'menu' ? 'show-mobile' : ''}`}>
            <li><Link to="/" className="footer-link">Inicio</Link></li>
            <li><Link to="/tienda" className="footer-link">Tienda</Link></li>
            <li><Link to="/noticias" className="footer-link">Noticias</Link></li>
            <li><Link to="/carrito" className="footer-link">Carrito</Link></li>
          </ul>
        </div>

        {/* Columna 4 - Contact Us */}
        <div className="footer-col">
          <h3 
            className="footer-title"
            onClick={() => toggleFooterSection('contact')}
          >
            Contact Us
          </h3>
          <ul className={`footer-links ${activeFooterSection === 'contact' ? 'show-mobile' : ''}`}>
            <li><a href="mailto:ElCorte@Corte.com" className="footer-link">ElCorte@Corte.com</a></li>
            <li><a href="tel:+50370848010" className="footer-link">+503 70848010</a></li>
            <li><span className="footer-link">Redes sociales</span></li>
          </ul>
        </div>
      </div>

      {/* Footer bottom - Copyright y redes sociales */}
      <div className="footer-bottom">
        <p className="footer-copyright">©2025 ITR | Todos los derechos reservados</p>
        <div className="footer-social">
          <a href="#" className="social-icon" aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="#" className="social-icon" aria-label="Instagram"> 
            <Instagram size={18} />
          </a>
          <a href="#" className="social-icon" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="#" className="social-icon" aria-label="YouTube">
            <Youtube size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;