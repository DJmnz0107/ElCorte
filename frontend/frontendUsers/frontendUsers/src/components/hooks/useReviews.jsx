import React, { useState, useEffect } from 'react';

const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Obtener todas las reseñas
    const getReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4000/api/reviews');
            if (!response.ok) {
                throw new Error('Error fetching reviews');
            }
            const data = await response.json();
            setReviews(data);
            return data;
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setError(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Obtener reseñas por producto
    const getReviewsByProduct = async (productID) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/reviews/product/${productID}`);
            if (!response.ok) {
                throw new Error('Error fetching product reviews');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            setError(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Obtener reseñas por cliente
    const getReviewsByCustomer = async (customerID) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/reviews/customer/${customerID}`);
            if (!response.ok) {
                throw new Error('Error fetching customer reviews');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching customer reviews:', error);
            setError(error.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Crear una nueva reseña
    const addReview = async (reviewData) => {
        setLoading(true);
        setError(null);
        try {
            // Mapear 'comment' a 'comments' para coincidir con el controlador
            const mappedReviewData = {
                comments: reviewData.comment || reviewData.comments,
                rating: reviewData.rating,
                customersID: reviewData.customersID,
                productID: reviewData.productID
            };

            const response = await fetch('http://localhost:4000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappedReviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creating review');
            }

            const result = await response.json();
            
            // Si el controlador devuelve solo un mensaje, necesitamos crear el objeto de reseña
            // para actualizar el estado local
            const newReview = {
                _id: Date.now().toString(), // ID temporal hasta que se recarguen las reseñas
                ...mappedReviewData,
                createdAt: new Date().toISOString()
            };
            
            setReviews(prevReviews => [...prevReviews, newReview]);
            return newReview;
        } catch (error) {
            console.error('Error creating review:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Actualizar una reseña
    const updateReview = async (reviewID, reviewData) => {
        setLoading(true);
        setError(null);
        try {
            // Mapear 'comment' a 'comments' para coincidir con el controlador
            const mappedReviewData = {
                comments: reviewData.comment || reviewData.comments,
                rating: reviewData.rating,
                customersID: reviewData.customersID,
                productID: reviewData.productID
            };

            const response = await fetch(`http://localhost:4000/api/reviews/${reviewID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mappedReviewData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error updating review');
            }

            const result = await response.json();
            
            // Actualizar el estado local
            setReviews(prevReviews => 
                prevReviews.map(review => 
                    review._id === reviewID ? { ...review, ...mappedReviewData } : review
                )
            );
            
            return { _id: reviewID, ...mappedReviewData };
        } catch (error) {
            console.error('Error updating review:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar una reseña
    const deleteReview = async (reviewID) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/reviews/${reviewID}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deleting review');
            }

            setReviews(prevReviews => 
                prevReviews.filter(review => review._id !== reviewID)
            );
            
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Cargar reseñas al inicializar (opcional)
    useEffect(() => {
        // Comentado por defecto para evitar cargas innecesarias
        // getReviews();
    }, []);

    return {
        reviews,
        loading,
        error,
        getReviews,
        getReviewsByProduct,
        getReviewsByCustomer,
        addReview,
        updateReview,
        deleteReview
    };
};

export default useReviews;