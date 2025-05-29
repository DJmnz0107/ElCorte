import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useDataProductsInterface = () => {
  const ApiBase = "http://localhost:4000/api/products";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProductId = (product) => product?._id || product?.id || product?.productId;

  // Cargar productos
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setProducts(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Convertir imagen base64 a Blob
  const base64ToBlob = async (base64) => (await fetch(base64)).blob();

  // ✅ FUNCIÓN AUXILIAR: Obtener producto completo con relaciones
  const fetchProductWithRelations = async (productId) => {
    try {
      // Intentar obtener el producto específico con relaciones
      const res = await fetch(`${ApiBase}/${productId}`);
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (error) {
      console.warn('No se pudo obtener producto con relaciones:', error);
      return null;
    }
  };

  // ✅ CORRECCIÓN: Agregar producto
  const handleAddProductBackend = async (productData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Campos requeridos
      formData.append('productName', productData.productName);
      formData.append('productDescription', productData.productDescription);
      formData.append('price', parseFloat(productData.price).toFixed(2));
      formData.append('stock', productData.stock);
      formData.append('discount', productData.discount || '0');
      formData.append('categoriesID', productData.categoriesID);
      formData.append('suppliersID', productData.suppliersID);

      // Manejo de imagen
      if (productData.image) {
        const blob = typeof productData.image === 'string' 
          ? await base64ToBlob(productData.image) 
          : productData.image;
        formData.append('image', blob, 'product-image.jpg');
      }

      const res = await fetch(ApiBase, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al agregar producto');
      }
      
      const newProduct = await res.json();
      console.log('Producto creado desde backend:', newProduct);
      
      // ✅ SOLUCIÓN 1: Intentar obtener el producto completo
      const productWithRelations = await fetchProductWithRelations(getProductId(newProduct));
      
      if (productWithRelations) {
        console.log('Producto con relaciones obtenido:', productWithRelations);
        setProducts(prev => [...prev, productWithRelations]);
      } else {
        // ✅ SOLUCIÓN 2: Si no se puede obtener con relaciones, refrescar todo
        console.log('Refrescando toda la lista de productos...');
        await fetchProducts();
      }
      
      toast.success('Producto agregado exitosamente');
      return newProduct;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECCIÓN: Actualizar producto
  const handleUpdateProductBackend = async (productData) => {
    try {
      setLoading(true);
      const id = getProductId(productData);
      if (!id) throw new Error("ID del producto no encontrado");

      // Preparar datos como antes...
      const hasImage = productData.image && typeof productData.image !== 'string';
      let body;
      let headers = {};

      if (hasImage) {
        const formData = new FormData();
        
        const fieldsToUpdate = [
          'productName', 'productDescription', 'price', 
          'stock', 'discount', 'categoriesID', 'suppliersID'
        ];
        
        fieldsToUpdate.forEach(field => {
          if (productData[field] !== undefined && productData[field] !== null) {
            let value = productData[field];
            if (field === 'price' || field === 'discount') {
              value = parseFloat(value);
              if (isNaN(value)) throw new Error(`${field} debe ser un número válido`);
            } else if (field === 'stock') {
              value = parseInt(value);
              if (isNaN(value)) throw new Error(`${field} debe ser un número entero`);
            }
            
            formData.append(field, value);
          }
        });

        if (productData.image) {
          const blob = typeof productData.image === 'string'
            ? await base64ToBlob(productData.image)
            : productData.image;
          formData.append('image', blob, 'product-image.jpg');
        }

        body = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        
        const updateData = {};
        const fields = [
          'productName', 'productDescription', 'price', 
          'stock', 'discount', 'categoriesID', 'suppliersID'
        ];
        
        fields.forEach(field => {
          if (productData[field] !== undefined && productData[field] !== null) {
            let value = productData[field];
            if (field === 'price' || field === 'discount') {
              value = parseFloat(value);
              if (isNaN(value)) throw new Error(`${field} debe ser un número válido`);
            } else if (field === 'stock') {
              value = parseInt(value);
              if (isNaN(value)) throw new Error(`${field} debe ser un número entero`);
            }
            
            updateData[field] = value;
          }
        });

        body = JSON.stringify(updateData);
      }

      console.log('Actualizando producto ID:', id);

      const res = await fetch(`${ApiBase}/${id}`, {
        method: 'PUT',
        headers: headers,
        body: body
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }
      
      const updatedProduct = await res.json();
      console.log('Producto actualizado desde backend:', updatedProduct);
      
      // ✅ SOLUCIÓN 1: Intentar obtener el producto completo
      const productWithRelations = await fetchProductWithRelations(id);
      
      if (productWithRelations) {
        console.log('Producto actualizado con relaciones:', productWithRelations);
        setProducts(prev => prev.map(p => 
          getProductId(p) === id ? productWithRelations : p
        ));
      } else {
        // ✅ SOLUCIÓN 2: Si no se puede obtener con relaciones, refrescar todo
        console.log('Refrescando toda la lista de productos...');
        await fetchProducts();
      }
      
      toast.success('Producto actualizado exitosamente');
      return updatedProduct;
    } catch (error) {
      console.error('Error completo al actualizar:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto (sin cambios, ya está bien)
  const handleDeleteProductBackend = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiBase}/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar producto');
      }
      
      setProducts(prev => prev.filter(p => getProductId(p) !== id));
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEBUGGING: Temporal para verificar el problema
  useEffect(() => {
    if (products.length > 0) {
      console.log('Estado productos actualizado:', products.map(p => ({
        id: getProductId(p),
        name: p.productName,
        supplier: p.supplier?.name || '❌ NULL',
        category: p.category?.name || '❌ NULL',
        hasSupplierObject: !!p.supplier,
        hasCategoryObject: !!p.category
      })));
    }
  }, [products]);

  return {
    products,
    loading,
    error,
    handleAddProductBackend,
    handleUpdateProductBackend,
    handleDeleteProductBackend,
    getProductId,
    fetchProducts
  };
};

export default useDataProductsInterface;