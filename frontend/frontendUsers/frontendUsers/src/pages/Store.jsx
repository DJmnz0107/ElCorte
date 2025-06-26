import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromoHeader from '../components/PromoHeader';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import useFetchProducts from '../components/hooks/useDataProducts';

const Store = () => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const navigate = useNavigate();
  
  const { products, categories } = useFetchProducts();

  // Debug - ver qué está pasando
  console.log('Store render - Products:', products?.length || 0);

  // Si no hay productos, mostrar loading
  if (!products || products.length === 0) {
    return (
      <div className="store-page">
        <PromoHeader />
        <div className="store-container">
          <div>Cargando productos...</div>
        </div>
      </div>
    );
  }

  // Procesamos los productos para añadir campos útiles
  const processedProducts = products.map(product => ({
    ...product,
    id: product._id,
    title: product.productName,
    description: product.productDescription,
    categoryName: product.categoriesID?.categoryName || 'Sin categoría',
    isPromo: product.discount > 0,
    finalPrice: product.price * (1 - (product.discount / 100))
  }));

  // Extraemos categorías únicas de los productos
  const uniqueCategories = ['Todos', 'Promociones'];
  products.forEach(product => {
    const catName = product.categoriesID?.categoryName;
    if (catName && !uniqueCategories.includes(catName)) {
      uniqueCategories.push(catName);
    }
  });

  // Filtramos los productos según la categoría seleccionada
  const filteredProducts = activeCategory === 'Todos' 
    ? processedProducts 
    : activeCategory === 'Promociones'
      ? processedProducts.filter(product => product.isPromo)
      : processedProducts.filter(product => product.categoryName === activeCategory);

  const handleProductClick = (product) => {
    console.log('Navegando a producto:', product);
    navigate('/product-detail', { state: { product } });
  };

  return (
    <div className="store-page">
      <PromoHeader />
      
      <div className="store-container">
        <CategoryFilter 
          categories={uniqueCategories}
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
    </div>
  );
};

export default Store;