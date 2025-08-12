const SAMPLE_PRODUCTS = [
	{ sku: "PRD-001", name: "Widget A", category: "Widgets", price: 49.99, stock: 120 },
	{ sku: "PRD-002", name: "Gadget B", category: "Gadgets", price: 89.0, stock: 42 },
	{ sku: "PRD-003", name: "Thingamajig C", category: "Accessories", price: 19.5, stock: 300 },
];

export default function Products() {
	return (
		<section className="space-y-4">
			<header className="flex items-end justify-between">
				<div>
					<h2 className="text-xl font-semibold text-slate-800">Products</h2>
					<p className="text-sm text-slate-500">Sample data only</p>
				</div>
				<button className="px-3 py-2 rounded bg-brand text-white text-sm">Add Product</button>
			</header>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
				<table className="min-w-full text-sm">
					<thead className="bg-slate-100 text-slate-600">
						<tr>
							<th className="px-4 py-2 text-left">SKU</th>
							<th className="px-4 py-2 text-left">Name</th>
							<th className="px-4 py-2 text-left">Category</th>
							<th className="px-4 py-2 text-right">Price</th>
							<th className="px-4 py-2 text-right">In Stock</th>
						</tr>
					</thead>
					<tbody>
						{SAMPLE_PRODUCTS.map((p) => (
							<tr key={p.sku} className="border-t border-slate-100">
								<td className="px-4 py-2 font-medium text-slate-800">{p.sku}</td>
								<td className="px-4 py-2">{p.name}</td>
								<td className="px-4 py-2">{p.category}</td>
								<td className="px-4 py-2 text-right">${p.price.toFixed(2)}</td>
								<td className="px-4 py-2 text-right">{p.stock}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
