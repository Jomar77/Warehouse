import { useState, useEffect } from 'react';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_URL;
                setLoading(true);
                
                // Fetch products and suppliers
                const [productsResponse, suppliersResponse] = await Promise.all([
                    fetch(`${baseURL}/api/Products`),
                    fetch(`${baseURL}/api/Suppliers`)
                ]);

                if (!productsResponse.ok || !suppliersResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const [productsData, suppliersData] = await Promise.all([
                    productsResponse.json(),
                    suppliersResponse.json()
                ]);
                
                setProducts(productsData);
                setSuppliers(suppliersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addProduct = async (formData) => {
        setSubmitting(true);
        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${baseURL}/api/Products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    supplierId: formData.supplierId ? parseInt(formData.supplierId) : null
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            const newProduct = await response.json();
            setProducts(prev => [...prev, newProduct]);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return {
        products,
        suppliers,
        loading,
        error,
        submitting,
        addProduct
    };
}
