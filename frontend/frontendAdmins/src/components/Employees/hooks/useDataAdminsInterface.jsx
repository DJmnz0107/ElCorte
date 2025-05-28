import { useState } from 'react';
import toast from 'react-hot-toast';

const useDataAdminsInterface = () => {
  const ApiCreateAdmin = "http://localhost:4000/api/employees";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    employeeDui: "",
    salary: "",
    address: "",
    role: "Admin"
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const cleanData = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      employeeDui: "",
      salary: "",
      address: "",
      role: "Admin"
    });
  };

  const validateFields = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'password',
      'dateOfBirth', 'employeeDui', 'salary', 'address'
    ];
     
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`Por favor, complete el campo ${field}`);
        return false;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Por favor, ingrese un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateFields()) return false;

    setStatus({ loading: true, success: false, error: null });

    try {
      const newAdmin = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        birthdate: formData.dateOfBirth,
        EmployeeDui: formData.employeeDui.trim(),
        salary: Number(formData.salary),
        role: formData.role,
        address: formData.address.trim(),
      };

      const response = await fetch(ApiCreateAdmin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al crear el administrador");
      }

      await response.json();
      cleanData();
      setStatus({ loading: false, success: true, error: null });
      toast.success('Administrador creado exitosamente');
      
      // Pequeño delay para que se vea el toast antes de la recarga
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return true;

    } catch (error) {
      console.error("Error:", error);
      setStatus({ loading: false, success: false, error: error.message });
      toast.error(error.message || 'Error al registrar administrador');
      return false;
    }
  };

  return {
    formData,
    handleChange,
    loading: status.loading,
    success: status.success,
    error: status.error,
    handleSubmit,
    setFormData
  };
};

export default useDataAdminsInterface;