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

            console.log('Fetching orders from:', url);

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
            console.log('Orders received:', data);
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

            console.log('Adding order:', orderData);

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
            console.log('Order created:', newOrder);
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
        // Actualización optimista - actualizamos el estado inmediatamente
        const optimisticUpdate = (prevOrders) => {
            return prevOrders.map((order) => {
                if (order._id === orderId) {
                    // Crear la orden actualizada manteniendo la estructura poblada
                    return {
                        ...order,
                        products: orderData.products.map((newProduct, index) => {
                            // Mantener la información poblada del producto original
                            const originalProduct = order.products[index];
                            return {
                                ...originalProduct,
                                ...newProduct,
                                // Asegurar que mantenemos la referencia poblada del productID
                                productID: originalProduct?.productID || newProduct.productID
                            };
                        }),
                        status: orderData.status || order.status
                    };
                }
                return order;
            });
        };

        // Actualizar estado optimísticamente
        setOrders(optimisticUpdate);

        try {
            setLoading(true);
            setError(null);

            console.log('Updating order:', orderId, orderData);

            const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                // Si falla, revertir el cambio optimista
                await getOrders(); // Recargar estado desde servidor
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const updatedOrder = await response.json();
            console.log('Order updated from server:', updatedOrder);
            
            // Actualizar con la respuesta real del servidor
            setOrders((prev) => {
                return prev.map((order) => 
                    order._id === orderId ? updatedOrder : order
                );
            });
            
            return updatedOrder;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función específica para actualizar cantidad de un producto en una orden
    const updateProductQuantity = async (orderId, productIndex, newQuantity) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Updating product quantity:', { orderId, productIndex, newQuantity });

            // Encontrar la orden en el estado local
            const currentOrder = orders.find(order => order._id === orderId);
            if (!currentOrder) {
                throw new Error('Orden no encontrada');
            }

            if (!currentOrder.products[productIndex]) {
                throw new Error('Producto no encontrado en la orden');
            }

            // Crear copia actualizada de los productos
            const updatedProducts = [...currentOrder.products];
            const product = updatedProducts[productIndex];
            
            updatedProducts[productIndex] = {
                ...product,
                amount: newQuantity,
                subTotal: (product.productID?.price || 0) * newQuantity
            };

            // Crear datos de orden actualizada
            const updatedOrderData = {
                ...currentOrder,
                products: updatedProducts
            };

            // Llamar a updateOrder
            return await updateOrder(orderId, updatedOrderData);

        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para remover un producto específico de una orden
    const removeProductFromOrder = async (orderId, productIndex) => {
        try {
            setLoading(true);
            setError(null);

            console.log('Removing product from order:', { orderId, productIndex });

            const currentOrder = orders.find(order => order._id === orderId);
            if (!currentOrder) {
                throw new Error('Orden no encontrada');
            }

            // Si solo hay un producto, eliminar toda la orden
            if (currentOrder.products.length === 1) {
                return await deleteOrder(orderId);
            }

            // Remover el producto específico
            const updatedProducts = currentOrder.products.filter((_, index) => index !== productIndex);
            
            const updatedOrderData = {
                ...currentOrder,
                products: updatedProducts
            };

            return await updateOrder(orderId, updatedOrderData);

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

            console.log('Deleting order:', orderId);

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

            console.log('Order deleted successfully');
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

        console.error('Error in useOrders:', errorMessage);
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
        updateProductQuantity,
        removeProductFromOrder,
        deleteOrder,
        clearError,
        loading,
        error,
    };
};

export default useOrders;