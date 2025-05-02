import { useState } from 'react';
import { GoogleMap } from '../components/MapComponent';
import { ContactForm } from '../components/ContactForm';
import morenoImage from '../assets/moreno_pensante.png';
import '../css/contactUs.css';

const ContactUs = () => {
  const [mapCenter] = useState({
    lat: 13.722996,
    lng: -89.205334,
  });

  return (
    <div className="contact-page">
      <section className="contact-encuentranos">
        <div className="contact-container">
          <h1>Encuéntranos!</h1>
          <p>Visítanos en nuestra ubicación central, donde podrás encontrar todos nuestros servicios y productos.</p>
          <p>Estamos disponibles de lunes a viernes de 9:00 AM a 6:00 PM y los sábados de 10:00 AM a 2:00 PM.</p>
          <p>¡Te esperamos para brindarte la mejor atención personalizada!</p>

          <div className="contact-map-container">
            <GoogleMap center={mapCenter} zoom={14} />
          </div>
        </div>
      </section>

      <section className="contact-contactanos">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-text-form">
              <div className="contact-info-box">
                <h2>Contáctanos</h2>
                <p>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>
                <p>También puedes comunicarte directamente con nosotros a través de nuestros canales de atención al cliente.</p>

                <div className="contact-details">
                  <div className="contact-detail-item">
                    <span className="contact-icon">📱</span>
                    <span>+503 70848010‬</span>
                  </div>
                  <div className="contact-detail-item">
                    <span className="contact-icon">✉</span>
                    <span>ElCorte@Corte.com</span>
                  </div>
                  <div className="contact-detail-item">
                    <span className="contact-icon">📍</span>
                    <span>Avenida Aguilares 218 San Salvador CP, San Salvador 1101X</span>
                  </div>
                </div>
              </div>

              <div className="contact-form-box">
                <ContactForm />
              </div>
            </div>

            <div className="contact-image-container">
              <img src={morenoImage} alt="Persona de contacto" className="contact-image" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
