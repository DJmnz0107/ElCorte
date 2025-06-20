import { useState } from 'react';

const useAddCustomer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addCustomer = async (customerData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Validación básica
            if (!customerData.email.includes('@')) {
                throw new Error('Por favor ingresa un email válido');
            }

            const response = await fetch('http://localhost:4000/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            let errorMessage = 'Error de conexión con el servidor';
            
            if (err.message.includes('Failed to fetch')) {
                errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión o si el servidor está funcionando.';
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { addCustomer, loading, error };
};

export default useAddCustomer;