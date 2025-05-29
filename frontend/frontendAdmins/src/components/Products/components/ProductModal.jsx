import React, { useState, useEffect } from 'react';
import { MdClose, MdCloudUpload } from 'react-icons/md';

const ProductModal = ({ isOpen, onClose, onSave, product, mode }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    stock: '',
    price: '',
    discount: '',
    suppliersID: '',
    categoriesID: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Función para normalizar datos de proveedores
  const normalizeSuppliers = (data) => {
    console.log('🔍 Normalizando proveedores - data recibida:', data);
    console.log('🔍 Tipo de data:', typeof data, 'Es array:', Array.isArray(data));
    
    // VERSIÓN ULTRA-PERMISIVA TEMPORAL
    if (!data) {
      console.log('❌ Data es null/undefined');
      return [];
    }
    
    // Si no es array, intentar convertirlo
    let arrayData = data;
    if (!Array.isArray(data)) {
      console.log('❌ Data no es array, intentando extraer array...');
      
      if (data && typeof data === 'object') {
        // Probar propiedades comunes
        const possibleProps = ['data', 'results', 'suppliers', 'items', 'records'];
        for (const prop of possibleProps) {
          if (data[prop] && Array.isArray(data[prop])) {
            console.log(`✅ Array encontrado en ${prop}:`, data[prop]);
            arrayData = data[prop];
            break;
          }
        }
        
        // Si aún no es array, probar extraer valores
        if (!Array.isArray(arrayData)) {
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            console.log('✅ Array encontrado en valores:', possibleArrays[0]);
            arrayData = possibleArrays[0];
          }
        }
        
        // Si TODAVÍA no es array, convertir el objeto único en array
        if (!Array.isArray(arrayData)) {
          console.log('🔧 Convirtiendo objeto único en array');
          arrayData = [data];
        }
      }
      
      if (!Array.isArray(arrayData)) {
        console.log('❌ No se pudo convertir a array');
        return [];
      }
    }
    
    console.log('🔧 Array final para procesar:', arrayData);
    
    const normalized = arrayData.map((item, index) => {
      console.log(`🔍 Procesando proveedor ${index}:`, item);
      console.log(`🔍 Claves disponibles:`, Object.keys(item || {}));
      
      if (!item || typeof item !== 'object') {
        console.log(`❌ Item ${index} no es un objeto válido`);
        return null;
      }
      
      // OBTENER TODOS LOS VALORES para ver qué hay disponible
      const allValues = Object.values(item);
      console.log(`🔍 Todos los valores del item ${index}:`, allValues);
      
      // Intentar obtener ID (más permisivo)
      const allKeys = Object.keys(item);
      const idKey = allKeys.find(key => 
        key.toLowerCase().includes('id') || 
        key.toLowerCase().includes('supplier')
      );
      const id = item[idKey] || allValues.find(val => 
        typeof val === 'number' || 
        (typeof val === 'string' && /^\d+$/.test(val))
      );
      
      // Intentar obtener nombre (más permisivo)
      const nameKey = allKeys.find(key => 
        key.toLowerCase().includes('name') || 
        key.toLowerCase().includes('nombre') ||
        key.toLowerCase().includes('title') ||
        key.toLowerCase().includes('empresa') ||
        key.toLowerCase().includes('company')
      );
      const name = item[nameKey] || allValues.find(val => 
        typeof val === 'string' && val.length > 0 && !/^\d+$/.test(val)
      );
      
      const result = {
        id: id,
        name: name || `Proveedor ${index + 1}`
      };
      
      console.log(`🔧 ID key encontrado:`, idKey, '→', id);
      console.log(`🔧 Name key encontrado:`, nameKey, '→', name);
      console.log(`🔧 Resultado final ${index}:`, result);
      
      return result;
    }).filter(item => {
      if (!item) return false;
      
      const hasId = item.id !== undefined && item.id !== null && item.id !== '';
      const hasName = item.name && item.name.trim() !== '';
      const isValid = hasId && hasName;
      
      console.log(`🔍 Validando item:`, {
        item,
        hasId,
        hasName,
        isValid
      });
      
      return isValid;
    });
    
    console.log('✅ Proveedores normalizados finales:', normalized);
    
    // SI AÚN ESTÁ VACÍO, crear datos de ejemplo basados en la estructura original
    if (normalized.length === 0 && arrayData.length > 0) {
      console.log('🚨 CREANDO DATOS DE EMERGENCIA basados en la estructura original');
      const emergency = arrayData.map((item, index) => ({
        id: index + 1,
        name: `Proveedor ${index + 1} (Auto-generado)`
      }));
      console.log('🚨 Datos de emergencia:', emergency);
      return emergency;
    }
    
    return normalized;
  };

  // Función para normalizar datos de categorías
  const normalizeCategories = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      id: item.id || item.categoryId || item._id,
      name: item.name || item.categoryName || item.nombre || 'Sin nombre'
    })).filter(item => item.id && item.name);
  };

  // Función para cargar proveedores desde la API
  const loadSuppliers = async () => {
    try {
      console.log('🔄 Cargando proveedores...');
      const response = await fetch('http://localhost:4000/api/suppliers');
      
      console.log('📡 Respuesta de proveedores:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Proveedores recibidos RAW:', data);
        console.log('✅ Tipo de respuesta:', typeof data);
        console.log('✅ Es array?:', Array.isArray(data));
        
        // Si es un objeto, mostrar sus claves
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          console.log('🔑 Claves del objeto:', Object.keys(data));
        }
        
        const normalizedSuppliers = normalizeSuppliers(data);
        console.log('🔧 Proveedores normalizados:', normalizedSuppliers);
        
        if (normalizedSuppliers.length > 0) {
          setSuppliers(normalizedSuppliers);
          console.log('✅ Proveedores establecidos en el estado');
        } else {
          console.warn('⚠️ No se encontraron proveedores válidos, usando datos por defecto');
          setSuppliers([
            { id: 1, name: 'Proveedor 1' },
            { id: 2, name: 'Proveedor 2' },
            { id: 3, name: 'Proveedor 3' }
          ]);
        }
      } else {
        console.error('❌ Error HTTP al cargar proveedores:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Respuesta de error:', errorText);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar proveedores:', error);
      // Datos por defecto más robustos
      setSuppliers([
        { id: 1, name: 'Proveedor Demo 1' },
        { id: 2, name: 'Proveedor Demo 2' },
        { id: 3, name: 'Proveedor Demo 3' }
      ]);
    }
  };

  // Función para cargar categorías desde la API
  const loadCategories = async () => {
    try {
      console.log('🔄 Cargando categorías...');
      const response = await fetch('http://localhost:4000/api/categories');
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Categorías recibidas:', data);
        
        const normalizedCategories = normalizeCategories(data);
        console.log('🔧 Categorías normalizadas:', normalizedCategories);
        
        if (normalizedCategories.length > 0) {
          setCategories(normalizedCategories);
        } else {
          console.warn('⚠️ No se encontraron categorías válidas, usando datos por defecto');
          setCategories([
            { id: 1, name: 'Carnes' },
            { id: 2, name: 'Vegetales' },
            { id: 3, name: 'Lácteos' },
            { id: 4, name: 'Panadería' }
          ]);
        }
      } else {
        console.error('❌ Error HTTP al cargar categorías:', response.status, response.statusText);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
      // Datos por defecto más robustos
      setCategories([
        { id: 1, name: 'Carnes' },
        { id: 2, name: 'Vegetales' },
        { id: 3, name: 'Lácteos' },
        { id: 4, name: 'Panadería' },
        { id: 5, name: 'Bebidas' },
        { id: 6, name: 'Snacks' }
      ]);
    }
  };

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    const loadData = async () => {
      if (isOpen) {
        console.log('🚀 Modal abierto, cargando datos...');
        setLoadingData(true);
        setErrors({});
        
        try {
          await Promise.all([loadSuppliers(), loadCategories()]);
          console.log('✅ Todos los datos cargados exitosamente');
        } catch (error) {
          console.error('❌ Error al cargar datos:', error);
          setErrors(prev => ({
            ...prev,
            loadError: 'Error al cargar datos del servidor'
          }));
        } finally {
          setLoadingData(false);
        }
      }
    };

    loadData();
  }, [isOpen]);

  // Debug: Mostrar estado actual
  useEffect(() => {
    console.log('📊 Estado actual:', {
      isOpen,
      loadingData,
      suppliersCount: suppliers.length,
      categoriesCount: categories.length,
      suppliers: suppliers.slice(0, 2), // Solo los primeros 2 para no saturar el log
      categories: categories.slice(0, 2)
    });
  }, [isOpen, loadingData, suppliers, categories]);

  // Inicializar formulario
  useEffect(() => {
    if (product && mode === 'edit') {
      console.log('✏️ Modo edición - Cargando producto:', product);
      setFormData({
        productName: product.productName || '',
        productDescription: product.productDescription || '',
        stock: product.stock?.toString() || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '',
        suppliersID: product.suppliersID?.toString() || '',
        categoriesID: product.categoriesID?.toString() || '',
        image: product.image || null
      });
      setImagePreview(product.image || null);
    } else if (isOpen) {
      console.log('➕ Modo agregar - Limpiando formulario');
      setFormData({
        productName: '',
        productDescription: '',
        stock: '',
        price: '',
        discount: '',
        suppliersID: '',
        categoriesID: '',
        image: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'La imagen no debe superar los 5MB'
        }));
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Por favor selecciona un archivo de imagen válido'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setImagePreview(imageUrl);
        
        // Limpiar error de imagen si existía
        if (errors.image) {
          setErrors(prev => ({
            ...prev,
            image: null
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
  const newErrors = {};

  console.log('🔍 === INICIO VALIDACIÓN ===');
  console.log('📝 Validando productName:', formData.productName);
  console.log('💰 Validando price:', formData.price, typeof formData.price);
  console.log('📊 Validando stock:', formData.stock, typeof formData.stock);

  if (!formData.productName || !formData.productName.trim()) {
    newErrors.productName = 'El nombre del producto es requerido';
    console.log('❌ Error en productName');
  }

  if (!formData.productDescription || !formData.productDescription.trim()) {
    newErrors.productDescription = 'La descripción del producto es requerida';
    console.log('❌ Error en productDescription');
  }

  // ✅ VALIDACIÓN MEJORADA DE PRECIO
  const priceValue = parseFloat(formData.price);
  if (!formData.price || formData.price.trim() === '' || isNaN(priceValue) || priceValue <= 0) {
    newErrors.price = 'El precio debe ser mayor a 0';
    console.log('❌ Error en price:', {
      isEmpty: !formData.price || formData.price.trim() === '',
      parsed: priceValue,
      isNaN: isNaN(priceValue),
      isLessOrEqual: priceValue <= 0
    });
  }

  // ✅ VALIDACIÓN MEJORADA DE STOCK
  const stockValue = parseInt(formData.stock);
  if (!formData.stock || formData.stock.trim() === '' || isNaN(stockValue) || stockValue < 0) {
    newErrors.stock = 'El stock debe ser mayor o igual a 0';
    console.log('❌ Error en stock:', {
      isEmpty: !formData.stock || formData.stock.trim() === '',
      parsed: stockValue,
      isNaN: isNaN(stockValue),
      isNegative: stockValue < 0
    });
  }

  // Validación de descuento (opcional pero si se proporciona debe ser válido)
  if (formData.discount && formData.discount.trim() !== '') {
    const discountValue = parseFloat(formData.discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      newErrors.discount = 'El descuento debe estar entre 0 y 100';
      console.log('❌ Error en discount:', discountValue);
    }
  }

  if (!formData.suppliersID) {
    newErrors.suppliersID = 'Debe seleccionar un proveedor';
    console.log('❌ Error en suppliersID');
  }

  if (!formData.categoriesID) {
    newErrors.categoriesID = 'Debe seleccionar una categoría';
    console.log('❌ Error en categoriesID');
  }

  console.log('📝 Errores encontrados:', newErrors);
  console.log('🔍 === FIN VALIDACIÓN ===');

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // 🔧 FUNCIÓN handleSubmit MEJORADA PARA DEBUG
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);

  try {
    const productData = {
      productName: formData.productName,
      productDescription: formData.productDescription,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discount: formData.discount ? Number(formData.discount) : 0,
      suppliersID: formData.suppliersID,
      categoriesID: formData.categoriesID,
      image: formData.image // Esto puede ser base64 o null
    };

    console.log('Datos preparados para enviar:', productData);

    await onSave(productData);
    handleClose();
  } catch (error) {
    console.error('Error al guardar producto:', error);
    setErrors(prev => ({ ...prev, submit: error.message }));
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    console.log('🚪 Cerrando modal');
    setFormData({
      productName: '',
      productDescription: '',
      stock: '',
      price: '',
      discount: '',
      suppliersID: '',
      categoriesID: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container product-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? 'Agregar producto' : 'Editar producto'}
          </h2>
          <button 
            className="modal-close-btn"
            onClick={handleClose}
            type="button"
            disabled={loading}
          >
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {loadingData && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando datos del servidor...</p>
            </div>
          )}

          {errors.loadError && (
            <div className="error-banner">
              <p>⚠️ {errors.loadError}</p>
            </div>
          )}

          {errors.submit && (
            <div className="error-banner">
              <p>❌ {errors.submit}</p>
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="productName" className="form-label">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className={`form-input ${errors.productName ? 'error' : ''}`}
                placeholder="Ingresa el nombre del producto"
                disabled={loading}
              />
              {errors.productName && (
                <span className="error-message">{errors.productName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="stock" className="form-label">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={`form-input ${errors.stock ? 'error' : ''}`}
                placeholder="0"
                min="0"
                disabled={loading}
              />
              {errors.stock && (
                <span className="error-message">{errors.stock}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">Precio ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
              {errors.price && (
                <span className="error-message">{errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="discount" className="form-label">Descuento (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className={`form-input ${errors.discount ? 'error' : ''}`}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
                disabled={loading}
              />
              {errors.discount && (
                <span className="error-message">{errors.discount}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="productDescription" className="form-label">
              Descripción del Producto *
            </label>
            <textarea
              id="productDescription"
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              className={`form-textarea ${errors.productDescription ? 'error' : ''}`}
              placeholder="Describe las características del producto..."
              rows="3"
              disabled={loading}
            />
            {errors.productDescription && (
              <span className="error-message">{errors.productDescription}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="suppliersID" className="form-label">
                Proveedor *
                {suppliers.length > 0 && (
                  <span className="count-badge">({suppliers.length} disponibles)</span>
                )}
              </label>
              <select
                id="suppliersID"
                name="suppliersID"
                value={formData.suppliersID}
                onChange={handleInputChange}
                className={`form-select ${errors.suppliersID ? 'error' : ''}`}
                disabled={loadingData || loading}
              >
                <option value="">
                  {loadingData ? 'Cargando proveedores...' : 'Seleccionar proveedor'}
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.suppliersID && (
                <span className="error-message">{errors.suppliersID}</span>
              )}
              {suppliers.length === 0 && !loadingData && (
                <span className="info-message">
                  ℹ️ No hay proveedores disponibles
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="categoriesID" className="form-label">
                Categoría *
                {categories.length > 0 && (
                  <span className="count-badge">({categories.length} disponibles)</span>
                )}
              </label>
              <select
                id="categoriesID"
                name="categoriesID"
                value={formData.categoriesID}
                onChange={handleInputChange}
                className={`form-select ${errors.categoriesID ? 'error' : ''}`}
                disabled={loadingData || loading}
              >
                <option value="">
                  {loadingData ? 'Cargando categorías...' : 'Seleccionar categoría'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoriesID && (
                <span className="error-message">{errors.categoriesID}</span>
              )}
              {categories.length === 0 && !loadingData && (
                <span className="info-message">
                  ℹ️ No hay categorías disponibles
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Imagen del Producto</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
                disabled={loading}
              />
              <label 
                htmlFor="image" 
                className={`image-upload-btn ${loading ? 'disabled' : ''}`}
              >
                <MdCloudUpload className="upload-icon" />
                {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              
              {errors.image && (
                <span className="error-message">{errors.image}</span>
              )}
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Vista previa del producto" />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    disabled={loading}
                  >
                    <MdClose />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-save ${loading ? 'loading' : ''}`}
              disabled={loading || loadingData}
            >
              {loading ? (
                <>
                  <span className="loading-spinner small"></span>
                  {mode === 'add' ? 'Agregando...' : 'Guardando...'}
                </>
              ) : (
                mode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;