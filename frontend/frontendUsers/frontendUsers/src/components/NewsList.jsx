import React from 'react';
import '../css/newsList.css'; // Archivo CSS actualizado

const NewsList = ({ news, layout = 'grid' }) => {
  return (
    <div className={`news-list ${layout}-layout`}>
      {news.map((item) => (
        <div key={item.id} className="news-item">
          <div className="news-image-container">
            <img src={item.image} alt={item.title} className="news-image" />
            {item.category && (
              <span className="news-category">{item.category}</span>
            )}
          </div>
          <div className="news-content">
            <h3 className="news-title">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;