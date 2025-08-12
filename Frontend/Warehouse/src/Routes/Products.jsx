import { useState } from 'react';
import ProductsHeader from '../Components/products/ProductsHeader';
import ProductsTable from '../Components/products/ProductsTable';
import AddProductModal from '../Components/products/AddProductModal';
import { LoadingState, ErrorState } from '../Components/products/LoadingState';
import { useProducts } from '../Components/products/useProducts';

export default function Products() {
    const [showAddModal, setShowAddModal] = useState(false);
    const { products, suppliers, loading, error, submitting, addProduct } = useProducts();

    const handleAddProduct = async (formData) => {
        const success = await addProduct(formData);
        if (success) {
            setShowAddModal(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    return (
        <section className="space-y-4">
            <ProductsHeader 
                productsCount={products.length}
                onAddProduct={() => setShowAddModal(true)}
            />

            <ProductsTable products={products} />

            <AddProductModal
                showModal={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddProduct}
                suppliers={suppliers}
                submitting={submitting}
            />
        </section>
    );
}
