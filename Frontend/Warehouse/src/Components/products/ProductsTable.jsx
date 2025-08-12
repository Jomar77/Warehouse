export default function ProductsTable({ products }) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                    <tr>
                        <th className="px-4 py-2 text-left">SKU</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Supplier</th>
                        <th className="px-4 py-2 text-right">Quantity</th>
                        <th className="px-4 py-2 text-right">Reorder Level</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.productId} className="border-t border-slate-100">
                                <td className="px-4 py-2 font-medium text-slate-800">{product.sku}</td>
                                <td className="px-4 py-2">{product.name}</td>
                                <td className="px-4 py-2">{product.category}</td>
                                <td className="px-4 py-2">{product.location}</td>
                                <td className="px-4 py-2">{product.supplier?.name || 'N/A'}</td>
                                <td className="px-4 py-2 text-right">
                                    <span className={product.quantityOnHand <= product.reorderLevel ? 'text-red-600 font-medium' : ''}>
                                        {product.quantityOnHand}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-right">{product.reorderLevel}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
