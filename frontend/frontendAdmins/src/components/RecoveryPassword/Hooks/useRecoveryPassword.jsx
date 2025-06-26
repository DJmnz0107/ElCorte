import { useState } from "react";
import toast from "react-hot-toast";

const useRecoveryPassword = () => {
  const ApiBase = "http://localhost:4000/api/recovery";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paso 1: Solicitar código
  const requestRecoveryCode = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiBase}/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al solicitar código");

      toast.success(data.message);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código
  const verifyRecoveryCode = async (code) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiBase}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al verificar código");

      toast.success(data.message);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: Establecer nueva contraseña
  const setNewPassword = async (newPassword) => {
    try {
      setLoading(true);
      const res = await fetch(`${ApiBase}/new-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cambiar contraseña");

      toast.success(data.message);
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    requestRecoveryCode,
    verifyRecoveryCode,
    setNewPassword
  };
};

export default useRecoveryPassword;
