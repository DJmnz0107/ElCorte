// hooks/useDataEmployeesInterface.js

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useDataEmployeesInterface = () => {
  const ApiBase = "http://localhost:4000/api/employees";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEmployeeId = (employee) => {
    if (!employee) return null;
    return employee._id || employee.id || employee.employeeId;
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(ApiBase);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al obtener empleados");
      }
      const data = await res.json();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployeeBackend = async (employeeData) => {
    setLoading(true);
    try {
      const newEmployee = {
        ...employeeData,
        role: "Employee", // Asignar automáticamente
      };

      const res = await fetch(ApiBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al agregar empleado");
      }

      toast.success("Empleado agregado exitosamente");
      await fetchEmployees();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployeeBackend = async (employeeData) => {
    setLoading(true);
    try {
      const id = getEmployeeId(employeeData);
      if (!id) throw new Error("ID de empleado no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al actualizar empleado");
      }

      toast.success("Empleado actualizado exitosamente");
      await fetchEmployees();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployeeBackend = async (id) => {
    setLoading(true);
    try {
      if (!id) throw new Error("ID de empleado no proporcionado");

      const res = await fetch(`${ApiBase}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Error al eliminar empleado");
      }

      toast.success("Empleado eliminado exitosamente");
      await fetchEmployees();
      return responseData;
    } catch (err) {
      toast.error(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    handleAddEmployeeBackend,
    handleUpdateEmployeeBackend,
    handleDeleteEmployeeBackend,
    getEmployeeId,
  };
};

export default useDataEmployeesInterface;
