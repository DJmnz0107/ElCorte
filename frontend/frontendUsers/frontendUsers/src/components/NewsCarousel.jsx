import React, { useState, useEffect } from 'react';
import '../css/newsCarousel.css'; // Archivo CSS para estilos

const NewsCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay del carrusel
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Navegación manual del carrusel
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Navegación con botones
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="news-carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
          >
            <div className="carousel-image-container">
              <img src={slide.image} alt={slide.title} className="carousel-image" />
              <div className="carousel-content">
                <span className="carousel-duration">6:15</span>
                <h3 className="carousel-title">{slide.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controles del carrusel */}
      <div className="carousel-controls">
        <button className="carousel-arrow prev" onClick={goToPrevSlide}>
          &lt;
        </button>
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
        <button className="carousel-arrow next" onClick={goToNextSlide}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default NewsCarousel;