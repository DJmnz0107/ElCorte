// Importa React y useState para manejar estado local
import { useState } from 'react';

// Importa el componente del mapa y el formulario de contacto desde su carpeta correspondiente
import { GoogleMap } from '../components/MapComponent';
import { ContactForm } from '../components/ContactForm';

// Importa la imagen y estilos CSS específicos para esta página
import morenoImage from '../assets/moreno_pensante.png';
import '../css/contactUs.css';

// Componente principal de la página de contacto
const ContactUs = () => {
  // Define el centro del mapa (latitud y longitud de la ubicación)
  const [mapCenter] = useState({
    lat: 13.722996,
    lng: -89.205334,
  });

  return (
    <div className="contact-page">
      <section className="encuentranos">
        <div className="container">
          <h1>Encuentranos!</h1>
          <p>Visítanos en nuestra ubicación central, donde podrás encontrar todos nuestros servicios y productos.</p>
          <p>Estamos disponibles de lunes a viernes de 9:00 AM a 6:00 PM y los sábados de 10:00 AM a 2:00 PM.</p>
          <p>¡Te esperamos para brindarte la mejor atención personalizada!</p>
          
          <div className="map-container">
            <GoogleMap center={mapCenter} zoom={14} />
          </div>
        </div>
      </section>

      <section className="contactanos">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-text-form">
              <div className="contact-info">
                <h2>Contactanos</h2>
                <p>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>
                <p>También puedes comunicarte directamente con nosotros a través de nuestros canales de atención al cliente.</p>
                
                <div className="contact-details">
                  <div className="detail-item">
                    <span className="icon">📱</span>
                    <span>+503 70848010</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">✉️</span>
                    <span>ElCorte@Corte.com</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>Avenida Aguilares 218 San Salvador CP, San Salvador 1101X</span>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-container">
                <ContactForm />
              </div>
            </div>
            
            <div className="image-container">
              <img src={morenoImage} alt="Persona de contacto" className="contact-image" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;

