import { useState, useCallback } from 'react';

const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);

    // GET: Obtener todas las órdenes
    const getOrders = useCallback(async (customerId = null) => {
        try {
            setLoading(true);
            setError(null);

            let url = 'http://localhost:4000/api/orders';
            if (customerId) {
                url += `?customersID=${customerId}`;
            }

            console.log('Fetching orders from:', url); // Debug

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('Orders received:', data); // Debug
            setOrders(data);
            return data;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // POST: Crear una nueva orden
    const addOrder = async (orderData) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Adding order:', orderData); // Debug

            if (!orderData.customersID) {
                throw new Error('El ID del cliente es obligatorio');
            }

            if (!orderData.products || orderData.products.length === 0) {
                throw new Error('Debe incluir al menos un producto');
            }

            const response = await fetch('http://localhost:4000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const newOrder = await response.json();
            console.log('Order created:', newOrder); // Debug
            setOrders((prev) => [...prev, newOrder]);
            return newOrder;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // PUT: Actualizar una orden existente
    const updateOrder = async (orderId, orderData) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Updating order:', orderId, orderData); // Debug

            const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const updatedOrder = await response.json();
            console.log('Order updated:', updatedOrder); // Debug
            
            setOrders((prev) => 
                prev.map((order) => order._id === orderId ? updatedOrder : order)
            );
            return updatedOrder;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE: Eliminar una orden por ID
    const deleteOrder = async (orderId) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Deleting order:', orderId); // Debug

            const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            console.log('Order deleted successfully'); // Debug
            setOrders((prev) => prev.filter((order) => order._id !== orderId));
            return true;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar errores
    const handleError = (err) => {
        let errorMessage = 'Error de conexión con el servidor';

        if (err.message.includes('Failed to fetch')) {
            errorMessage =
                'No se pudo conectar al servidor. Verifica tu conexión o si el servidor está funcionando.';
        } else {
            errorMessage = err.message;
        }

        console.error('Error in useOrders:', errorMessage); // Debug
        setError(errorMessage);
    };

    // Función para limpiar errores
    const clearError = () => {
        setError(null);
    };

    return {
        orders,
        getOrders,
        addOrder,
        updateOrder,
        deleteOrder,
        clearError,
        loading,
        error,
    };
};

export default useOrders;