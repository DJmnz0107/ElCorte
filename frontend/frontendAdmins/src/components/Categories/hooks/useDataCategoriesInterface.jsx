import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useDataCategoriesInterface = () => {
  const ApiBase = "http://localhost:4000/api/categories";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategoryId = (category) => {
    if (!category) return null;
    return category._id || category.id || category.categoryId;
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al obtener categorías");
      }
      const data = await res.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategoryBackend = async (categoryData) => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al agregar categoría");
      }

      toast.success("Categoría agregada exitosamente");
      await fetchCategories();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategoryBackend = async (categoryData) => {
    setLoading(true);
    try {
      const id = getCategoryId(categoryData);
      if (!id) throw new Error("ID de categoría no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al actualizar categoría");
      }

      toast.success("Categoría actualizada exitosamente");
      await fetchCategories();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategoryBackend = async (id) => {
    setLoading(true);
    try {
      if (!id) throw new Error("ID de categoría no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al eliminar categoría");
      }

      toast.success("Categoría eliminada exitosamente");
      await fetchCategories();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    handleAddCategoryBackend,
    handleUpdateCategoryBackend,
    handleDeleteCategoryBackend,
    getCategoryId,
  };
};

export default useDataCategoriesInterface;
