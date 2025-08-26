export default function SupplierHeader({ suppliersCount, onAddSupplier }) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
                <p className="text-slate-600">
                    Manage your supplier information and contacts
                    {suppliersCount > 0 && ` • ${suppliersCount} supplier${suppliersCount !== 1 ? 's' : ''}`}
                </p>
            </div>
            <button
                onClick={onAddSupplier}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Supplier
            </button>
        </div>
    );
}
