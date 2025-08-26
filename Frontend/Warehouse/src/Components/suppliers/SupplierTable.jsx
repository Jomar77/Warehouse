export default function SupplierTable({ suppliers, onEdit, onDelete }) {
    if (suppliers.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p>No suppliers found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Supplier Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Contact Person
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Products
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {suppliers.map((supplier) => (
                        <tr key={supplier.supplierId} className="hover:bg-slate-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                                <div className="font-medium text-slate-900">{supplier.name}</div>
                                {supplier.address && (
                                    <div className="text-sm text-slate-500">{supplier.address}</div>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                {supplier.contactPerson || '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                {supplier.email ? (
                                    <a 
                                        href={`mailto:${supplier.email}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {supplier.email}
                                    </a>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-900">
                                {supplier.phone ? (
                                    <a 
                                        href={`tel:${supplier.phone}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {supplier.phone}
                                    </a>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                                {supplier.products && supplier.products.length > 0 ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {supplier.products.length} product{supplier.products.length !== 1 ? 's' : ''}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                        No products
                                    </span>
                                )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(supplier)}
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                        title="Edit supplier"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(supplier.supplierId)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded"
                                        title="Delete supplier"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
