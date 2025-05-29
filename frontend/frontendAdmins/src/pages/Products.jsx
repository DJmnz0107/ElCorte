import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import ProductCard from '../components/Products/Components/ProductCard';
import ProductModal from '../components/Products/Components/ProductModal';
import ConfirmationModal from '../components/Products/Components/ConfirmationModal';
import '../css/products.css';
import useDataProductsInterface from '../components/Products/hooks/useDataProductsInterface';

const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState(null);
  const [productToDeleteName, setProductToDeleteName] = useState('');

  const {
    products,
    loading,
    handleAddProductBackend,
    handleUpdateProductBackend,
    handleDeleteProductBackend,
    getProductId,
  } = useDataProductsInterface();

  // ✅ SOLUCIÓN: Filtrado mejorado con debugging
  useEffect(() => {
    console.log('Filtering products:', { 
      productsCount: products?.length || 0, 
      searchTerm 
    });
    
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    if (searchTerm === '') {
      setFilteredProducts([...products]); // ✅ Crear nueva referencia
    } else {
      const filtered = products.filter(product => {
        const nameMatch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = product.productDescription?.toLowerCase().includes(searchTerm.toLowerCase());
        const supplierMatch = product.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return nameMatch || descMatch || supplierMatch || categoryMatch;
      });
      
      console.log('Filtered results:', filtered.length);
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]); // ✅ Dependencias correctas

  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    const id = getProductId(product);
    if (!id) {
      console.error('No se pudo obtener el ID del producto');
      return;
    }
    
    setProductToDeleteId(id);
    setProductToDeleteName(product.productName || 'Producto sin nombre');
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDeleteId) {
      try {
        await handleDeleteProductBackend(productToDeleteId);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDeleteId(null);
        setProductToDeleteName('');
      }
    }
  };

  // ✅ SOLUCIÓN: Función de guardado mejorada con mejor manejo de errores
  const handleSaveProduct = async (productData) => {
    try {
      console.log('Saving product:', { mode: modalMode, data: productData });
      
      const preparedData = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        discount: productData.discount ? parseFloat(productData.discount) : 0,
        suppliersID: productData.suppliersID,
        categoriesID: productData.categoriesID
      };

      if (modalMode === 'add') {
        console.log('Adding new product...');
        await handleAddProductBackend(preparedData);
        
        // ✅ SOLUCIÓN: Limpiar búsqueda para mostrar nuevo producto
        if (searchTerm) {
          console.log('Clearing search to show new product');
          setSearchTerm('');
        }
      } else {
        console.log('Updating existing product...');
        await handleUpdateProductBackend({
          ...preparedData,
          _id: getProductId(selectedProduct)
        });
      }
      
      setIsModalOpen(false);
      setSelectedProduct(null);
      console.log('Product saved successfully');
      
    } catch (error) {
      console.error('Error in handleSaveProduct:', error);
      throw error; // Re-lanzar para que el modal pueda manejarlo
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalMode('add');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ✅ SOLUCIÓN: Mostrar estado de carga específico
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="products-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1 className="products-title">Gestión de productos</h1>

        <div className="products-actions">
          <div className="search-container">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button
            className="btn btn-add"
            onClick={handleAddProduct}
            disabled={loading}
          >
            <MdAdd className="btn-icon" />
            {loading ? 'Cargando...' : 'Agregar'}
          </button>
        </div>
      </div>

      {/* ✅ SOLUCIÓN: Mostrar información de debug en desarrollo */}

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>
            {products && products.length > 0 
              ? 'No se encontraron productos con ese término de búsqueda.' 
              : 'No hay productos disponibles.'
            }
          </p>
          {searchTerm && (
            <div>
              <p>Término de búsqueda: "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={getProductId(product)}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="¿Estás seguro?"
        message="Esta acción eliminará permanentemente el producto"
        itemName={productToDeleteName}
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Productos;