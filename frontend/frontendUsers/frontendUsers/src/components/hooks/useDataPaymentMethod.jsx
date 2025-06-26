import React, { useState, useEffect, useCallback } from 'react';

const usePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:4000/api/payments';

    // Función para manejar errores de forma consistente
    const handleError = useCallback((error, defaultMessage) => {
        console.error(defaultMessage, error);
        const errorMessage = error.response?.data?.message || error.message || defaultMessage;
        setError(errorMessage);
        throw new Error(errorMessage);
    }, []);

    // Crear un nuevo método de pago básico
    const createPaymentMethod = useCallback(async (paymentMethodData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Enviando datos al servidor:', paymentMethodData);
            
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentMethodData),
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
            }
            
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            
            // CRUCIAL: Verificar que el servidor devuelva el objeto completo con _id
            if (!result._id && !result.id && !result.data?._id) {
                console.error('El servidor no devolvió un ID válido:', result);
                throw new Error('El servidor no devolvió el método de pago con un ID válido');
            }
            
            // Actualizar el estado local con el método creado
            const createdMethod = result.data || result;
            setPaymentMethods(prev => [...prev, createdMethod]);
            
            return result;
        } catch (error) {
            console.error('Error en createPaymentMethod:', error);
            handleError(error, 'Error creating payment method');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Obtener todos los métodos de pago
    const getPaymentMethods = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setPaymentMethods(data);
            return data;
        } catch (error) {
            handleError(error, 'Error fetching payment methods');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    // Crear un método de pago con datos de tarjeta (versión específica)
    const createPaymentMethodRecord = useCallback(async (cardNumbers, user, formData) => {
        try {
            console.log('=== CREANDO MÉTODO DE PAGO ===');

            // Validar parámetros requeridos
            if (!user || !formData) {
                throw new Error('User y formData son requeridos');
            }

            // Convertir MM/YY a fecha válida para MongoDB
            const convertExpiryToDate = (expiryString) => {
                if (!expiryString || expiryString.length !== 5) {
                    throw new Error('Formato de fecha de expiración inválido');
                }
                
                const [month, year] = expiryString.split('/');
                const fullYear = 2000 + parseInt(year);
                
                const expirationDate = new Date(fullYear, parseInt(month) - 1, 1);
                expirationDate.setMonth(expirationDate.getMonth() + 1);
                expirationDate.setDate(0);
                
                return expirationDate.toISOString();
            };

            const paymentMethodData = {
                customerId: user?.id || user?._id,
                paymentMethodType: 'Credit Card',
                cardNumber: cardNumbers,
                cardHolderName: formData.cardHolder,
                expirationDate: convertExpiryToDate(formData.expiryDate),
                cvv: formData.cvv,
                isActive: true,
                createdDate: new Date().toISOString()
            };

            console.log('Datos del método de pago a enviar:', paymentMethodData);

            const response = await createPaymentMethod(paymentMethodData);
            console.log('Respuesta completa del servidor:', response);

            // MEJORADO: Manejo más robusto de la respuesta
            let createdPaymentMethod;
            
            // Verificar diferentes estructuras de respuesta
            if (response?.data?._id) {
                // Estructura: { message: "...", data: { _id: "...", ... } }
                createdPaymentMethod = response.data;
                console.log('✅ Método extraído de response.data con _id:', createdPaymentMethod._id);
            } else if (response?._id) {
                // Respuesta directa con _id
                createdPaymentMethod = response;
                console.log('✅ Método directo con _id:', createdPaymentMethod._id);
            } else if (response?.id) {
                // Respuesta directa con id
                createdPaymentMethod = response;
                console.log('✅ Método directo con id:', createdPaymentMethod.id);
            } else {
                // No se encontró un ID válido
                console.error('❌ Respuesta sin ID válido:', response);
                throw new Error('El servidor no devolvió el método de pago con un ID válido. Verifica que el backend esté creando correctamente el documento en MongoDB.');
            }

            // Verificar que el ID sea un ObjectId válido de MongoDB
            const paymentMethodId = createdPaymentMethod._id || createdPaymentMethod.id;
            
            if (!paymentMethodId) {
                throw new Error('El método de pago no tiene un ID válido');
            }

            // Validar formato de ObjectId (24 caracteres hexadecimales)
            const objectIdRegex = /^[0-9a-fA-F]{24}$/;
            if (!objectIdRegex.test(paymentMethodId)) {
                console.error('❌ ID no es un ObjectId válido:', paymentMethodId);
                throw new Error(`El ID "${paymentMethodId}" no es un ObjectId válido de MongoDB. Debe ser un string hexadecimal de 24 caracteres.`);
            }

            console.log('✅ Método de pago creado exitosamente con ObjectId válido:', paymentMethodId);
            return createdPaymentMethod;

        } catch (error) {
            console.error('❌ Error creando método de pago:', error);
            throw new Error(`Error al crear método de pago: ${error.message}`);
        }
    }, [createPaymentMethod]);

    // Resto de métodos sin cambios...
    const updatePaymentMethod = useCallback(async (id, paymentMethodData) => {
        if (!id || !paymentMethodData) {
            throw new Error('ID and payment method data are required');
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentMethodData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Actualizar el estado local
            setPaymentMethods(prev => 
                prev.map(method => method.id === id ? result : method)
            );
            
            return result;
        } catch (error) {
            handleError(error, 'Error updating payment method');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const deletePaymentMethod = useCallback(async (id) => {
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
            
            // Actualizar el estado local removiendo el método eliminado
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
            
            return result;
        } catch (error) {
            handleError(error, 'Error deleting payment method');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const getPaymentMethodById = useCallback(async (id) => {
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
            handleError(error, 'Error fetching payment method');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const getPaymentMethodsByUser = useCallback(async (userId) => {
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
            handleError(error, 'Error fetching user payment methods');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refresh = useCallback(() => {
        return getPaymentMethods();
    }, [getPaymentMethods]);

    useEffect(() => {
        getPaymentMethods();
    }, [getPaymentMethods]);

    return {
        // Estado
        paymentMethods,
        loading,
        error,
        
        // Acciones
        getPaymentMethods,
        createPaymentMethod,
        createPaymentMethodRecord,
        updatePaymentMethod,
        deletePaymentMethod,
        getPaymentMethodById,
        getPaymentMethodsByUser,
        clearError,
        refresh
    };
};

export default usePaymentMethods;