import React from 'react';
import CardAbout from '../components/CardAbout';
import '../css/aboutUs.css'; // Asegúrate de que la ruta sea correcta
import partnersCollage from '../assets/partners-collage.png';

const AboutUs = () => {
  // Datos de ejemplo para las tarjetas
  const teamMembers = [
    {
      id: 1,
      title: 'DIEGO JIMENEZ',
      description: 'Desarrollador Full Stack especializado en la creación de plataformas de e-commerce. Apasionado por optimizar la experiencia del usuario y garantizar que cada compra sea rápida, segura y eficiente.'
    },
    {
      id: 2,
      title: 'MARCOS LOPEZ',
      description: 'Ingeniero de Software y líder de backend, responsable de construir sistemas robustos y escalables para el manejo seguro de pedidos, pagos y envíos de productos premium.'
    },
    {
      id: 3,
      title: 'MAXIMILIANO LARA',
      description: 'Diseñador UI/UX enfocado en ofrecer interfaces intuitivas y atractivas. Su creatividad y atención al detalle aseguran que cada visitante disfrute una navegación cómoda y agradable.'
    },
    {
      id: 4,
      title: 'EL EQUIPO',
      description: 'Un grupo multidisciplinario de profesionales comprometidos en revolucionar la forma en que las personas compran carne de calidad en línea, combinando innovación tecnológica y pasión por la excelencia.'
    }
  ];

  // Ya no necesitamos el array de partners individuales

  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1 className="about-us-title">Sobre nosotros</h1>
        <p className="about-us-subtitle">
        Somos un equipo de desarrolladores apasionados por la tecnología y la excelencia, dedicados a crear una plataforma ágil, segura y fácil de usar para la venta de los mejores cortes de carne. Nuestro objetivo es conectar a los amantes de la buena carne con productos de calidad excepcional, asegurando una experiencia de compra confiable y satisfactoria desde el primer clic.
        </p>
      </div>
      
      <div className="about-us-cards">
        {teamMembers.map((member) => (
          <div key={member.id} className="card-wrapper">
            <CardAbout 
              title={member.title} 
              description={member.description} 
            />
          </div>
        ))}
      </div>

      {/* Sección de Nuestros Socios */}
      <div className="partners-section">
        <div className="partners-content">
          <div className="partners-text">
            <h2 className="partners-title">Nuestros Socios</h2>
            <p className="partners-description">
            En nuestra misión por ofrecer siempre lo mejor, contamos con aliados estratégicos que comparten nuestros valores de calidad, compromiso y excelencia. Gracias a su apoyo, seguimos creciendo y ofreciendo
            </p>
            <p className="partners-description">
            experiencias únicas a nuestros clientes.
            </p>
            <p className="partners-description">
            Nos sentimos orgullosos de trabajar de la mano con marcas líderes en su sector.
            </p>
          </div>
          <div className="partners-logos">
          <img
  src={partnersCollage}
  alt="Nuestros socios: La Pampa, Carnitas Mamá Chole, El Lomo, Los Ranchos, Casa Escobar"
  className="partners-collage"
/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;