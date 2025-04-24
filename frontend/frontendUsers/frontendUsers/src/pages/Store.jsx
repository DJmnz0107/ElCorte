import React, { useState } from 'react';
import PromoHeader from '../components/PromoHeader';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

const Store = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  const categories = ['Todos', 'Carnes', 'Promociones', 'Accesorios', 'Paquetes'];
  
  const products = [
    {
      id: 1,
      category: "Carnes",
      title: "Lomo de Cerdo Premium",
      description: "1/2 Libra de corte selecto",
      price: "95.50",
      promo: true
    },
    {
      id: 2,
      category: "Accesorios",
      title: "Kit de Tenedores Gourmet",
      description: "Set de 4 tenedores profesionales",
      price: "35.99"
    },
    {
      id: 3,
      category: "Carnes",
      title: "Ribeye Angus",
      description: "Corte premium 500g",
      price: "125.00"
    },
    {
      id: 4,
      category: "Paquetes",
      title: "Parrillada Familiar",
      description: "Variedad de carnes para 6 personas",
      price: "299.00"
    },
    {
      id: 5,
      category: "Carnes",
      title: "Pechuga de Pollo Orgánico",
      description: "Empaque de 1kg",
      price: "85.00"
    },
    {
      id: 6,
      category: "Promociones",
      title: "Combo Carnes + Carbón",
      description: "2kg de carne + bolsa de carbón",
      price: "199.00",
      promo: true
    }
  ];

  const filteredProducts = activeCategory === 'Todos' 
  ? products 
  : products.filter(product => product.category === activeCategory || 
                            (activeCategory === 'Promociones' && product.promo));

                            return (
                                <div className="store-page">
                                  <PromoHeader />
                                  
                                  <div className="store-container">
                                    <CategoryFilter 
                                      categories={categories}
                                      activeCategory={activeCategory}
                                      onSelect={setActiveCategory}
                                    />
                                    
                                    {/* CONTENEDOR CON SCROLL HORIZONTAL */}
                                    <div className="products-container">
                                      {filteredProducts.map(product => (
                                        <div 
                                          key={product.id}
                                          className={`product-card ${product.promo ? 'promo' : ''}`}
                                        >
                                          {product.promo && <div className="promo-badge">PROMO</div>}
                                          <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            className="product-image"
                                          />
                                          <div className="product-category">{product.category}</div>
                                          <h3 className="product-title">{product.title}</h3>
                                          <p className="product-description">{product.description}</p>
                                          <div className="product-price">${product.price}</div>
                                          <div className="product-rating">
  {[...Array(5)].map((_, i) => (
    <span key={i} className="star">★</span>
  ))}
</div>                                          <div className="sold-out">Almost sold out</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            };



export default Store;