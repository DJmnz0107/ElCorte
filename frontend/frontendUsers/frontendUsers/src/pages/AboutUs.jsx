import React from 'react';
import CardAbout from '../components/CardAbout';
import '../css/aboutUs.css'; // Asegúrate de que la ruta sea correcta

const AboutUs = () => {
  // Datos de ejemplo para las tarjetas
  const teamMembers = [
    {
      id: 1,
      title: 'DIEGO JIMENEZ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.'
    },
    {
      id: 2,
      title: 'MARCOS LOPEZ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.'
    },
    {
      id: 3,
      title: 'MAXIMILIANO LARA',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.'
    },
    {
      id: 4,
      title: 'EL EQUIPO',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.'
    }
  ];

  // Ya no necesitamos el array de partners individuales

  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1 className="about-us-title">Sobre nosotros</h1>
        <p className="about-us-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Nunc odio in et, lectus sit lorem id integer.
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
            </p>
            <p className="partners-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
            </p>
            <p className="partners-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc odio in et, lectus sit lorem id integer.
            </p>
          </div>
          <div className="partners-logos">
            <img 
              src="/assets/logos/partners-collage.png" 
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