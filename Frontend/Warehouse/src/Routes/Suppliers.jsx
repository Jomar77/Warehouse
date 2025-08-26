import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import SupplierHeader from '../Components/suppliers/SupplierHeader';
import SupplierTable from '../Components/suppliers/SupplierTable';
import AddSupplierModal from '../Components/suppliers/AddSupplierModal';
import EditSupplierModal from '../Components/suppliers/EditSupplierModal';
import { SearchInput } from '../Components/ui/SearchInput';

export default function Suppliers() {
    const { authenticatedFetch } = useAuth();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSuppliers = () => {
        setLoading(true);
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Suppliers`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch suppliers');
                return response.json();
            })
            .then(data => {
                setSuppliers(data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleAddSupplier = (formData) => {
        setSubmitting(true);
        return authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Suppliers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Failed to create supplier');
                    });
                }
                return fetchSuppliers();
            })
            .then(() => {
                setShowAddModal(false);
                return true;
            })
            .catch(err => {
                alert(err.message);
                return false;
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleEditSupplier = (formData) => {
        setSubmitting(true);
        return authenticatedFetch(
            `${import.meta.env.VITE_API_URL}/api/Suppliers/${editingSupplier.supplierId}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    supplierId: editingSupplier.supplierId,
                    ...formData
                })
            }
        )
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Failed to update supplier');
                    });
                }
                return fetchSuppliers();
            })
            .then(() => {
                setEditingSupplier(null);
                return true;
            })
            .catch(err => {
                alert(err.message);
                return false;
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleDeleteSupplier = (supplierId) => {
        if (!confirm('Are you sure you want to delete this supplier? This action cannot be undone.')) {
            return;
        }

        authenticatedFetch(
            `${import.meta.env.VITE_API_URL}/api/Suppliers/${supplierId}`,
            { method: 'DELETE' }
        )
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Failed to delete supplier');
                    });
                }
                return fetchSuppliers();
            })
            .catch(err => {
                alert(err.message);
            });
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-500">Loading suppliers...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-800">Error: {error}</div>
                <button
                    onClick={fetchSuppliers}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-4">
            <SupplierHeader
                suppliersCount={suppliers.length}
                onAddSupplier={() => setShowAddModal(true)}
            />

            <div className="bg-white rounded-lg border border-slate-200">
                <div className="p-4 border-b border-slate-200">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search suppliers by name, contact person, or email..."
                    />
                </div>

                <SupplierTable
                    suppliers={filteredSuppliers}
                    onEdit={setEditingSupplier}
                    onDelete={handleDeleteSupplier}
                />
            </div>

            <AddSupplierModal
                showModal={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddSupplier}
                submitting={submitting}
            />

            {editingSupplier && (
                <EditSupplierModal
                    supplier={editingSupplier}
                    onClose={() => setEditingSupplier(null)}
                    onSubmit={handleEditSupplier}
                    submitting={submitting}
                />
            )}
        </section>
    );
}
