import React, { useState, useEffect } from 'react';

const useFetchProducts = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);


    const getProducts = async () =>  {
        try {
            const response = await fetch('http://localhost:4000/api/products');
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const getCategories = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/categories');
            if (!response.ok) {
                throw new Error('Error fetching categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    } 
    
        useEffect(()=>{
        getProducts();
        getCategories();
    },
     [])

     return {
        products,
        categories,
        getProducts,
        getCategories 
     }
}

export default useFetchProducts;    