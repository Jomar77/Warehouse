import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export default function EditSupplierModal({ supplier, onClose, onSubmit, submitting }) {
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || '',
                contactPerson: supplier.contactPerson || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || ''
            });
        }
    }, [supplier]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Supplier name is required';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        onSubmit(formData)
            .then(success => {
                if (success) {
                    setErrors({});
                }
            });
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <Modal show={!!supplier} onClose={handleClose} title="Edit Supplier">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">
                        Supplier Name *
                    </label>
                    <input
                        type="text"
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Enter supplier name"
                        disabled={submitting}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="edit-contactPerson" className="block text-sm font-medium text-slate-700 mb-1">
                        Contact Person
                    </label>
                    <input
                        type="text"
                        id="edit-contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter contact person name"
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="edit-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Enter email address"
                        disabled={submitting}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="edit-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.phone ? 'border-red-300' : 'border-slate-300'
                        }`}
                        placeholder="Enter phone number"
                        disabled={submitting}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="edit-address" className="block text-sm font-medium text-slate-700 mb-1">
                        Address
                    </label>
                    <textarea
                        id="edit-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter supplier address"
                        disabled={submitting}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={submitting}
                    >
                        {submitting && (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}
                        {submitting ? 'Updating...' : 'Update Supplier'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
