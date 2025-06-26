import React, { useState, useEffect, useCallback } from 'react';

const usePurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:4000/api/purchases';

    // Función para manejar errores de forma consistente
    const handleError = useCallback((error, defaultMessage) => {
        console.error(defaultMessage, error);
        const errorMessage = error.response?.data?.message || error.message || defaultMessage;
        setError(errorMessage);
        throw new Error(errorMessage);
    }, []);

    // Obtener todas las compras
    const getPurchases = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setPurchases(data);
            return data;
        } catch (error) {
            handleError(error, 'Error fetching purchases');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Crear una nueva compra
    const createPurchase = useCallback(async (purchaseData) => {
        if (!purchaseData) {
            throw new Error('Purchase data is required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Actualizar el estado local agregando la nueva compra
            setPurchases(prev => [...prev, result]);
            
            return result;
        } catch (error) {
            handleError(error, 'Error creating purchase');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Actualizar una compra existente
    const updatePurchase = useCallback(async (id, purchaseData) => {
        if (!id || !purchaseData) {
            throw new Error('ID and purchase data are required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Actualizar el estado local
            setPurchases(prev => 
                prev.map(purchase => purchase.id === id ? result : purchase)
            );
            
            return result;
        } catch (error) {
            handleError(error, 'Error updating purchase');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Eliminar una compra
    const deletePurchase = useCallback(async (id) => {
        if (!id) {
            throw new Error('ID is required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Actualizar el estado local removiendo la compra eliminada
            setPurchases(prev => prev.filter(purchase => purchase.id !== id));
            
            return result;
        } catch (error) {
            handleError(error, 'Error deleting purchase');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Obtener compra por ID
    const getPurchaseById = useCallback(async (id) => {
        if (!id) {
            throw new Error('ID is required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            handleError(error, 'Error fetching purchase');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Obtener compras por usuario
    const getPurchasesByUser = useCallback(async (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            handleError(error, 'Error fetching user purchases');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Limpiar error manualmente
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Refrescar datos
    const refresh = useCallback(() => {
        return getPurchases();
    }, [getPurchases]);

    // Cargar las compras al montar el componente
    useEffect(() => {
        getPurchases();
    }, [getPurchases]);

    return {
        // Estado
        purchases,
        loading,
        error,
        
        // Acciones
        getPurchases,
        createPurchase,
        updatePurchase,
        deletePurchase,
        getPurchaseById,
        getPurchasesByUser,
        clearError,
        refresh
    };
};

export default usePurchases;