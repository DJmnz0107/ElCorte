import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PromoHeader from '../components/PromoHeader';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

const Store = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const navigate = useNavigate();
  
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

  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  return (
    <div className="store-page">
      <PromoHeader />
      
      <div className="store-container">
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        
        <div className="products-container">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      </div>
      <div>
      <Link to="/confirm-payment">Probar</Link>      
      </div>
    </div>
  );
};

export default Store;