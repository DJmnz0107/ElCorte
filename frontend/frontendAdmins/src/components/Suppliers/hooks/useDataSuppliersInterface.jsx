import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useDataSuppliersInterface = () => {
  const ApiBase = "http://localhost:4000/api/suppliers";

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el ID correcto del proveedor
  // Función para obtener el ID correcto del proveedor - versión mejorada
const getSupplierId = (supplier) => {
  if (!supplier) return null;
  
  // Verificar todos los posibles nombres de campo para el ID
  return supplier._id || supplier.id || supplier.suppliersId || supplier.supplierId;
};

  // Cargar proveedores desde backend
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al obtener proveedores");
      }
      const data = await res.json();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Agregar proveedor
  const handleAddSupplierBackend = async (supplierData) => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al agregar proveedor");
      }

      toast.success("Proveedor agregado exitosamente");
      await fetchSuppliers(); // Refrescar la lista
      return responseData; // Retornar el proveedor creado
    } catch (err) {
      toast.error(err.message);
      throw err; // Re-lanzar el error para manejo adicional si es necesario
    } finally {
      setLoading(false);
    }
  };

  // Actualizar proveedor
  const handleUpdateSupplierBackend = async (supplierData) => {
    setLoading(true);
    try {
      const id = getSupplierId(supplierData);
      if (!id) throw new Error("ID de proveedor no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al actualizar proveedor");
      }

      toast.success("Proveedor actualizado exitosamente");
      await fetchSuppliers(); // Refrescar la lista
      return responseData; // Retornar el proveedor actualizado
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar proveedor
  const handleDeleteSupplierBackend = async (id) => {
    setLoading(true);
    try {
      if (!id) throw new Error("ID de proveedor no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al eliminar proveedor");
      }

      toast.success("Proveedor eliminado exitosamente");
      await fetchSuppliers(); // Refrescar la lista
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    error,
    handleAddSupplierBackend,
    handleUpdateSupplierBackend,
    handleDeleteSupplierBackend,
    getSupplierId,
  };
};

export default useDataSuppliersInterface;