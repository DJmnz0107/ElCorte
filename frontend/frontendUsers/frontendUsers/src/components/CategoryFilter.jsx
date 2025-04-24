import React from 'react';
import '../css/categoryFilter.css'; // Archivo CSS para estilos

const CategoryFilter = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category}
          className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;