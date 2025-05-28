// Importa React y el hook useState para manejar estados locales
import React, { useState } from 'react';

// Importa Link para enlaces y useNavigate para redireccionar
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Importa componentes usados en esta página
import PromoHeader from '../components/PromoHeader';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

// Componente principal de la tienda
const Store = () => {
  // Estado para manejar la categoría seleccionada
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Hook de navegación para redireccionar a detalle de producto
  const navigate = useNavigate();

  // Lista de categorías disponibles
  const categories = ['Todos', 'Carnes', 'Promociones', 'Accesorios', 'Paquetes'];

  // Datos de productos (mocked/static)
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

  // Filtrado de productos según categoría activa
  const filteredProducts = activeCategory === 'Todos' 
    ? products 
    : products.filter(product => 
        product.category === activeCategory || 
        (activeCategory === 'Promociones' && product.promo)
      );

  // Función que maneja el clic sobre un producto y redirige a su detalle
  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
  };

  return (
    <div className="store-page">
      {/* Encabezado promocional */}
      <PromoHeader />
      
      <div className="store-container">
        {/* Componente de filtros de categoría */}
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        
        {/* Renderizado de productos filtrados */}
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
    </div>
  );
};

// Exporta el componente para su uso en rutas u otros componentes
export default Store;
