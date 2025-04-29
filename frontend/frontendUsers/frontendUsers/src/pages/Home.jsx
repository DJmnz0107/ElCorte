import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="main-container">
      <div className="home-container">
        {/* Texto lado izquierdo */}
        <div className="text-content">
          <h1>
            Calidad en cada <span>corte</span>,<br />
            sabor en cada <span>plato</span>.
          </h1>
          <p>
            Carnes frescas y de alta calidad de origen local. Desde jugosos cortes hasta tiernos filetes, ofrecemos lo mejor para tu mesa.<br />
            ¡Visítanos y disfruta de la mejor carne!
          </p>
          <button className="order-button">Ordena Ahora</button>
        </div>

        {/* Imagen y círculo lado derecho */}
        <div className="image-container">
          {/* Círculo de fondo */}
          <div className="circle-background"></div>

          {/* Imagen del hombre */}
          <img
            src="/src/assets/cowbow.webp"
            alt="Hombre comiendo carne"
            className="main-image"
          />

          {/* Badge flotante */}
          <div className="badge">
            <span>Mejor calidad en</span>
            <img src="/src/assets/elsalvador.png" alt="Bandera El Salvador" />
          </div>

          {/* Tarjetas de productos */}
          <div className="product-card left">
            <img src="/src/assets/elcorte.jpeg" alt="Cowboy Steak" />
            <div>
              <p className="title">Cowboy Steak</p>
              <p className="price">$18.00</p>
            </div>
          </div>

          <div className="product-card right">
            <img src="/src/assets/tomahawk.jpeg" alt="Tomahawk" />
            <div>
              <p className="title">Tomahawk</p>
              <p className="price">$23.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Categorías */}
      <div className="categories-section">
        <h3 className="section-subtitle">FAVORITOS DE LOS CLIENTES</h3>
        <h2 className="section-title">Categorías</h2>
        
        <div className="categories-container">
          <div className="category-card">
            <div className="category-icon-container">
              <img src="/src/assets/premium-cuts.png" alt="Cortes Premium" className="category-icon" />
            </div>
            <h4>Cortes PREMIUM</h4>
            <p>20 tipos de carnes</p>
          </div>
          
          <div className="category-card">
            <div className="category-icon-container">
              <img src="/src/assets/utensilios.png" alt="Utensilios" className="category-icon" />
            </div>
            <h4>Utensilios</h4>
            <p>12 tipos</p>
          </div>
          
          <div className="category-card">
            <div className="category-icon-container">
              <img src="/src/assets/salsas.png" alt="Salsas" className="category-icon" />
            </div>
            <h4>Salsas</h4>
            <p>48 salsas</p>
          </div>
          
          <div className="category-card">
            <div className="category-icon-container">
              <img src="/src/assets/todos.png" alt="Todos los productos" className="category-icon" />
            </div>
            <h4>Todos</h4>
            <p>100 productos</p>
          </div>
        </div>
      </div>

      {/* Sección de Carnes Especiales */}
      <div className="special-meats-section">
        <h3 className="section-subtitle">CARNES ESPECIALES</h3>
        
        <div className="special-meats-container">
          <div className="meat-card">
            <div className="meat-image-container">
              <img src="/src/assets/ribeye.png" alt="Ribeye" className="meat-image" />
              <button className="add-to-cart-btn"></button>
            </div>
            <div className="meat-details">
              <h4 className="meat-name">Ribeye</h4>
              <p className="meat-description">Jugoso, tierno y con la cantidad perfecta de sabor para tu parrilla.</p>
              <div className="meat-price-rating">
                <span className="meat-price">$24.00</span>
                <div className="rating">
                  <span className="star">★</span>
                  <span className="rating-value">4.8</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="meat-card">
            <div className="meat-image-container">
              <img src="/src/assets/new-york.png" alt="New York Steak" className="meat-image" />
              <button className="add-to-cart-btn"></button>
            </div>
            <div className="meat-details">
              <h4 className="meat-name">New York Steak</h4>
              <p className="meat-description">Corte premium con un balance perfecto entre sabor y textura.</p>
              <div className="meat-price-rating">
                <span className="meat-price">$26.00</span>
                <div className="rating">
                  <span className="star">★</span>
                  <span className="rating-value">4.8</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="meat-card">
            <div className="meat-image-container">
              <img src="/src/assets/tbone.png" alt="T Bone Steak" className="meat-image" />
              <button className="add-to-cart-btn"></button>
            </div>
            <div className="meat-details">
              <h4 className="meat-name">T Bone Steak</h4>
              <p className="meat-description">Corte en forma de "T" con sabor y lomo.</p>
              <div className="meat-price-rating">
                <span className="meat-price">$23.00</span>
                <div className="rating">
                  <span className="star">★</span>
                  <span className="rating-value">4.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="see-all-container">
          <button className="see-all-button">
            TODOS LOS PRODUCTOS
          </button>
        </div>
      </div>

      {/* Sección de Nuestra Historia */}
      <div className="our-history-section">
        <div className="our-history-content">
          <div className="our-history-text">
            <h3 className="section-subtitle">NUESTRA HISTORIA</h3>
            <h2 className="section-title">Nuestra gran aventura como amantes de la carne.</h2>
            <p className="history-description">
              Detrás de nuestra tienda de carne hay un equipo comprometido con la excelencia y la innovación en el sector cárnico.
            </p>
            <button className="know-more-button">Conoce más</button>
          </div>

          <div className="team-cards-container">
            <div className="team-card">
              <div className="team-icon">
                <img src="/src/assets/lock-icon.png" alt="Seguridad" />
              </div>
              <h3 className="team-role">CTO</h3>
              <p className="team-name">Marcos Alejandro<br />López Martínez</p>
            </div>

            <div className="team-card">
              <div className="team-icon">
                <img src="/src/assets/bulb-icon.png" alt="Ideas" />
              </div>
              <h3 className="team-role">CMO</h3>
              <p className="team-name">Maximiliano Xavier<br />Rivera Lara</p>
            </div>

            <div className="team-card team-card-ceo">
              <div className="team-icon">
                <img src="/src/assets/briefcase-icon.png" alt="Liderazgo" />
              </div>
              <h3 className="team-role">CEO</h3>
              <p className="team-name">Diego Josué Jiménez Alas</p>
            </div>

            <div className="team-button-container">
              <button className="team-button">
                <span className="team-button-icon">
                  <img src="/src/assets/team-icon.png" alt="Equipo" />
                </span>
                EQUIPO DE CARNÍVOROS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="reviews-section">
        <div className="reviews-content">
          <div className="reviews-image-container">
            <img src="/src/assets/reviews-image.png" alt="Cliente satisfecho" className="reviews-image" />
          </div>
          
          <div className="reviews-text">
            <h3 className="section-subtitle">RESEÑAS</h3>
            <h2 className="section-title">Esto es lo que dicen nuestros carnívoros</h2>
            
            <p className="testimonial">
              Excelente calidad en los cortes y atención de primera. Siempre encuentro justo lo que necesito para mis parrilladas. ¡Totalmente recomendado!
            </p>
            
            <div className="reviews-rating">
              <div className="reviews-avatars">
                <img src="/src/assets/avatar1.png" alt="Usuario" className="avatar" />
                <img src="/src/assets/avatar2.png" alt="Usuario" className="avatar" />
                <img src="/src/assets/avatar3.png" alt="Usuario" className="avatar" />
              </div>
              <div className="rating-container">
                <h4>Reseñas</h4>
                <div className="rating">
                  <span className="star">★</span>
                  <span className="rating-value">4.3</span>
                  <span className="total-reviews">(18.6k Reseñas)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}