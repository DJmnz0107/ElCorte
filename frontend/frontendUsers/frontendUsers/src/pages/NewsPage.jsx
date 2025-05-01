import React, { useState, useEffect } from 'react';
import NewsCarousel from '../components/NewsCarousel';
import NewsList from '../components/NewsList';
import { fetchCarnivoraNews, fetchTopNews, fetchCarouselSlides } from '../services/apiNews.js';
import '../css/newsPage.css';

const NewsPageWithAPI = () => {
  // Estado para almacenar los datos de la API
  const [carnivoraNews, setCarnivoraNews] = useState([]);
  const [topNews, setTopNews] = useState([]);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos en paralelo
        const [carnivora, top, carousel] = await Promise.all([
          fetchCarnivoraNews(),
          fetchTopNews(),
          fetchCarouselSlides()
        ]);
        
        setCarnivoraNews(carnivora);
        setTopNews(top);
        setCarouselSlides(carousel);
        setError(null);
      } catch (err) {
        console.error('Error loading news data:', err);
        setError('Ha ocurrido un error al cargar las noticias. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  // Mostrar indicador de carga
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    );
  }

  // Mostrar mensaje de error si es necesario
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-container">
        {/* Sección de noticias carnívoras */}
        <div className="news-section carnivora-section">
          <h2 className="section-title">Noticias Carnívoras</h2>
          <NewsList news={carnivoraNews} layout="grid" />
        </div>
        
        {/* Sección de noticias destacadas */}
        <div className="news-section top-section">
          <h2 className="section-title">Noticias Top</h2>
          <NewsList news={topNews} layout="vertical" />
        </div>
        
        {/* Sección de educación carnívora con carrusel */}
        <div className="news-section education-section">
          <h2 className="section-title">Educación Carnívora</h2>
          <NewsCarousel slides={carouselSlides} />
        </div>
      </div>
      
    </div>
  );
};

export default NewsPageWithAPI;