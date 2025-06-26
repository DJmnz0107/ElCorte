import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useDataCustomersInterface = () => {
  const ApiBase = "http://localhost:4000/api/customers";

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener ID del customer
  const getCustomerId = (customer) => {
    if (!customer) return null;
    return customer._id || customer.id || customer.customerId;
  };

  // Obtener lista de clientes
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al obtener clientes");
      }
      const data = await res.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Agregar cliente
  const handleAddCustomerBackend = async (customerData) => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al agregar cliente");
      }

      toast.success("Cliente agregado exitosamente");
      await fetchCustomers();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cliente
  const handleUpdateCustomerBackend = async (customerData) => {
    setLoading(true);
    try {
      const id = getCustomerId(customerData);
      if (!id) throw new Error("ID de cliente no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al actualizar cliente");
      }

      toast.success("Cliente actualizado exitosamente");
      await fetchCustomers();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar cliente
  const handleDeleteCustomerBackend = async (id) => {
    setLoading(true);
    try {
      if (!id) throw new Error("ID de cliente no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al eliminar cliente");
      }

      toast.success("Cliente eliminado exitosamente");
      await fetchCustomers();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    handleAddCustomerBackend,
    handleUpdateCustomerBackend,
    handleDeleteCustomerBackend,
    getCustomerId,
  };
};

export default useDataCustomersInterface;
