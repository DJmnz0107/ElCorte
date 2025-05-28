import { useEffect, useRef } from 'react';
import '../css/mapComponent.css';

export const GoogleMap = ({ center, zoom }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
 
    const loadLeafletMap = async () => {
      try {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css';
        document.head.appendChild(linkElement);
        
        await new Promise(resolve => {
          linkElement.onload = resolve;
        });
        
        if (window.L) {
          initializeMap();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.js';
        script.async = true;
        document.head.appendChild(script);
        
        script.onload = () => {
          initializeMap();
        };
        
        return () => {
          document.head.removeChild(script);
          document.head.removeChild(linkElement);
        };
      } catch (error) {
        console.error('Error loading Leaflet map:', error);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }


      const map = window.L.map(mapRef.current).setView([center.lat, center.lng], zoom);
      mapInstanceRef.current = map;


      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      window.L.marker([center.lat, center.lng]).addTo(map)
        .bindPopup('Nuestra ubicación')
        .openPopup();
    };

    loadLeafletMap();

  
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [center, zoom]);

  return (
    <div className="google-map-container">
      <div ref={mapRef} className="google-map"></div>
      {!window.L && (
        <div className="map-loading">
          <p>Cargando mapa...</p>
        </div>
      )}
    </div>
  );
};


GoogleMap.defaultProps = {
  zoom: 15
};