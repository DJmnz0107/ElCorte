import React, { useState, useEffect } from "react";
import "./Home.css";
import useFetchProducts from "../components/hooks/useDataProducts";
import useReviews from "../components/hooks/useReviews";
import { 
  Beef, 
  Utensils, 
  Droplets, 
  Package, 
  Zap,
  Cherry,
  Coffee,
  Star,
  Users,
  Award,
  User,
  ChefHat,
  Flame,
  ShoppingBag,
  Bird,
  Fish
} from "lucide-react";

export default function Home() {
  const { products, categories } = useFetchProducts();
  const { reviews, getReviews } = useReviews();
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [displayedReviews, setDisplayedReviews] = useState([]);

  // Obtener el producto con mayor precio para la sección de carnes especiales
  useEffect(() => {
    if (products.length > 0) {
      const highestPriceProduct = products.reduce((max, product) => 
        product.price > max.price ? product : max
      );
      setFeaturedProduct(highestPriceProduct);
    }
  }, [products]);

  // Obtener reseñas al cargar el componente - SOLO UNA VEZ
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsData = await getReviews();
      setDisplayedReviews(reviewsData.slice(0, 3));
    };
    
    fetchReviews();
  }, []); // Removido getReviews de las dependencias para evitar reinicio

  // Función para calcular promedio de rating de las reseñas mostradas
  const calculateAverageRating = () => {
    if (displayedReviews.length === 0) return 4.3;
    const sum = displayedReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / displayedReviews.length).toFixed(1);
  };

  // Función para obtener el icono de categoría
  const getCategoryIcon = (categoryName, index) => {
    const name = categoryName?.toLowerCase() || '';
    
    if (name.includes('res') || name.includes('beef') || name.includes('carne')) {
      return <Beef size={40} style={{color: '#dc2626'}} />;
    } else if (name.includes('cerdo') || name.includes('pork') || name.includes('cochino')) {
      return <Package size={40} style={{color: '#f97316'}} />;
    } else if (name.includes('pollo') || name.includes('chicken') || name.includes('ave')) {
      return <Bird size={40} style={{color: '#eab308'}} />;
    } else if (name.includes('pavo') || name.includes('turkey')) {
      return <ChefHat size={40} style={{color: '#84cc16'}} />;
    } else if (name.includes('pescado') || name.includes('fish') || name.includes('mariscos')) {
      return <Fish size={40} style={{color: '#0ea5e9'}} />;
    } else if (name.includes('utensilio') || name.includes('herramienta') || name.includes('accesorio')) {
      return <Utensils size={40} style={{color: '#6b7280'}} />;
    } else if (name.includes('salsa') || name.includes('condimento') || name.includes('aderezo')) {
      return <Droplets size={40} style={{color: '#dc2626'}} />;
    } else if (name.includes('picante') || name.includes('chile') || name.includes('pepper')) {
      return <Zap size={40} style={{color: '#ef4444'}} />;
    } else {
      // Iconos por defecto basados en el índice
      const defaultIcons = [
        <Beef size={40} style={{color: '#dc2626'}} />,
        <Utensils size={40} style={{color: '#6b7280'}} />,
        <Droplets size={40} style={{color: '#dc2626'}} />,
        <Package size={40} style={{color: '#f97316'}} />
      ];
      return defaultIcons[index % 4];
    }
  };

  return (
    <div className="main-container">
      <div className="home-container">
        {/* Sección de texto del lado izquierdo con título, descripción y botón */}
        <div className="text-content">
          <h1>
            Calidad en cada <span>corte</span>,<br />
            sabor en cada <span>plato</span>.
          </h1>
          <p>
            Carnes frescas y de alta calidad de origen local. Descubre la diferencia 
            en cada bocado con nuestros productos seleccionados especialmente para ti.
          </p>
          <button className="order-button">
            <ShoppingBag size={20} style={{marginRight: '8px'}} />
            Ordena Ahora
          </button>
        </div>

        {/* Contenedor de imagen del lado derecho con círculo decorativo e imagen central */}
        <div className="image-container">
          <div className="circle-background"></div>

          {/* Imagen principal como en la versión original */}
          <img
            src="/src/assets/cowbow.webp"
            alt="Hombre comiendo carne"
            className="main-image"
          />

          {/* Insignia con bandera de El Salvador */}
          <div className="badge">
            <span>Mejor calidad en</span>
            <img src="/src/assets/elsalvador.png" alt="Bandera El Salvador" />
          </div>

          {/* Tarjetas de productos flotantes a los lados con imágenes reales */}
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

      {/* Sección de Categorías populares - CON ICONOS */}
      <div className="categories-section">
        <h3 className="section-subtitle">FAVORITOS DE LOS CLIENTES</h3>
        <h2 className="section-title">Categorías</h2>
        
        <div className="categories-container">
          {categories.length > 0 ? (
            categories.slice(0, 4).map((category, index) => (
              <div key={category._id} className="category-card">
                <div className="category-icon-container">
                  {getCategoryIcon(category.categoryName, index)}
                </div>
                <h4>{category.categoryName}</h4>
                <p>{category.categoryDescription}</p>
              </div>
            ))
          ) : (
            // Fallback con iconos por defecto
            <>
              <div className="category-card">
                <div className="category-icon-container">
                  <Beef size={40} style={{color: '#dc2626'}} />
                </div>
                <h4>Cortes PREMIUM</h4>
                <p>20 tipos de carnes</p>
              </div>
              <div className="category-card">
                <div className="category-icon-container">
                  <Utensils size={40} style={{color: '#6b7280'}} />
                </div>
                <h4>Utensilios</h4>
                <p>12 tipos</p>
              </div>
              <div className="category-card">
                <div className="category-icon-container">
                  <Droplets size={40} style={{color: '#dc2626'}} />
                </div>
                <h4>Salsas</h4>
                <p>48 salsas</p>
              </div>
              <div className="category-card">
                <div className="category-icon-container">
                  <Package size={40} style={{color: '#f97316'}} />
                </div>
                <h4>Todos</h4>
                <p>100 productos</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sección de productos especiales - PRODUCTO REAL CON IMAGEN */}
      <div className="special-meats-section">
        <h3 className="section-subtitle">CARNES ESPECIALES</h3>
        
        <div className="special-meats-container">
          {featuredProduct ? (
            <div className="meat-card">
              <div className="meat-image-container">
                <img 
                  src={featuredProduct.image || "/src/assets/ribeye.png"} 
                  alt={featuredProduct.productName} 
                />
              </div>
              <div className="meat-details">
                <h4 className="meat-name">{featuredProduct.productName}</h4>
                <p className="meat-description">
                  {featuredProduct.description || "Jugoso, tierno y de la mejor calidad. Perfecto para asados especiales."}
                </p>
                <div className="meat-price-rating">
                  <span className="meat-price">${featuredProduct.price.toFixed(2)}</span>
                  <div className="rating">
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span className="rating-value">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Fallback mientras cargan los productos
            <div className="meat-card">
              <div className="meat-image-container">
                <img src="/src/assets/ribeye.png" alt="Ribeye" />
              </div>
              <div className="meat-details">
                <h4 className="meat-name">Cargando producto especial...</h4>
                <p className="meat-description">Obteniendo el mejor corte para ti...</p>
                <div className="meat-price-rating">
                  <span className="meat-price">$--</span>
                  <div className="rating">
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span className="rating-value">--</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón para ver todos los productos */}
        <div className="see-all-container">
          <button className="see-all-button">
            <Package size={20} style={{marginRight: '8px'}} />
            TODOS LOS PRODUCTOS
          </button>
        </div>
      </div>

      {/* Sección de historia de la empresa */}
      <div className="our-history-section">
        <div className="our-history-content">
          <div className="our-history-text">
            <h3 className="section-subtitle">NUESTRA HISTORIA</h3>
            <h2 className="section-title">Nuestra gran aventura...</h2>
            <p className="history-description">
              Detrás de nuestra tienda hay una historia de pasión por la carne de calidad. 
              Comenzamos como un pequeño negocio familiar con el sueño de ofrecer los mejores 
              cortes de carne a nuestra comunidad, y hoy seguimos comprometidos con esa misión.
            </p>
            <button className="know-more-button">
              <ChefHat size={20} style={{marginRight: '8px'}} />
              Conoce más
            </button>
          </div>

          {/* Tarjetas de equipo con iconos */}
          <div className="team-cards-container">
            <div className="team-card">
              <div className="team-icon">
                <Award size={32} className="team-role-icon" />
              </div>
              <h3 className="team-role">CTO</h3>
              <p className="team-name">Marcos Alejandro<br />López Martínez</p>
            </div>

            <div className="team-card">
              <div className="team-icon">
                <User size={32} className="team-role-icon" />
              </div>
              <h3 className="team-role">CMO</h3>
              <p className="team-name">Maximiliano Xavier<br />Rivera Lara</p>
            </div>

            <div className="team-card team-card-ceo">
              <div className="team-icon">
                <Users size={32} className="team-role-icon" />
              </div>
              <h3 className="team-role">CEO</h3>
              <p className="team-name">Diego Josué Jiménez Alas</p>
            </div>

            <div className="team-button-container">
              <button className="team-button">
                <span className="team-button-icon">
                  <Users size={24} />
                </span>
                EQUIPO DE CARNÍVOROS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de reseñas de clientes - CON ICONOS */}
      <div className="reviews-section">
        <div className="reviews-content">
          <div className="reviews-image-container">
            <div className="reviews-icon-placeholder">
              <User size={80} style={{color: '#6b7280'}} />
            </div>
          </div>

          <div className="reviews-text">
            <h3 className="section-subtitle">RESEÑAS</h3>
            <h2 className="section-title">Esto es lo que dicen nuestros carnívoros</h2>
            
            {/* Mostrar reseñas reales */}
            <div className="testimonials-container">
              {displayedReviews.length > 0 ? (
                displayedReviews.map((review, index) => (
                  <div key={review._id} className="testimonial-item">
                    <p className="testimonial">
                      "{review.comments}"
                    </p>
                    <div className="testimonial-rating">
                      <Star size={16} fill="#ffd700" color="#ffd700" />
                      <span className="rating-value">{review.rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="testimonial-item">
                  <p className="testimonial">
                    "Excelente calidad en los cortes y atención de primera clase"
                  </p>
                  <div className="testimonial-rating">
                    <Star size={16} fill="#ffd700" color="#ffd700" />
                    <span className="rating-value">4.5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reseñas con avatares usando iconos */}
            <div className="reviews-rating">
              <div className="reviews-avatars">
                <div className="avatar-placeholder">
                  <User size={24} style={{color: '#6b7280'}} />
                </div>
                <div className="avatar-placeholder">
                  <User size={24} style={{color: '#6b7280'}} />
                </div>
                <div className="avatar-placeholder">
                  <User size={24} style={{color: '#6b7280'}} />
                </div>
              </div>
              <div className="rating-container">
                <h4>Reseñas</h4>
                <div className="rating">
                  <Star size={20} fill="#ffd700" color="#ffd700" />
                  <span className="rating-value">{calculateAverageRating()}</span>
                  <span className="total-reviews">
                    ({displayedReviews.length > 0 ? displayedReviews.length : '18.6k'} Reseñas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}