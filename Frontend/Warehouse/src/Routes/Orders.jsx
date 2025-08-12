const SAMPLE_ORDERS = [
	{ id: "ORD-1001", customer: "Acme Corp", items: 12, total: 1540.5, status: "Pending", date: "2025-08-01" },
	{ id: "ORD-1002", customer: "Globex", items: 5, total: 420.0, status: "Shipped", date: "2025-08-02" },
	{ id: "ORD-1003", customer: "Soylent", items: 8, total: 899.99, status: "Pending", date: "2025-08-03" },
];

export default function Orders() {
	return (
		<section className="space-y-4">
			<header className="flex items-end justify-between">
				<div>
					<h2 className="text-xl font-semibold text-slate-800">Orders</h2>
					<p className="text-sm text-slate-500">Sample data only</p>
				</div>
				<button className="px-3 py-2 rounded bg-brand text-white text-sm">Create Order</button>
			</header>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
				<table className="min-w-full text-sm">
					<thead className="bg-slate-100 text-slate-600">
						<tr>
							<th className="px-4 py-2 text-left">Order ID</th>
							<th className="px-4 py-2 text-left">Customer</th>
							<th className="px-4 py-2 text-right">Items</th>
							<th className="px-4 py-2 text-right">Total</th>
							<th className="px-4 py-2 text-left">Status</th>
							<th className="px-4 py-2 text-left">Date</th>
						</tr>
					</thead>
					<tbody>
						{SAMPLE_ORDERS.map((o) => (
							<tr key={o.id} className="border-t border-slate-100">
								<td className="px-4 py-2 font-medium text-slate-800">{o.id}</td>
								<td className="px-4 py-2">{o.customer}</td>
								<td className="px-4 py-2 text-right">{o.items}</td>
								<td className="px-4 py-2 text-right">${o.total.toFixed(2)}</td>
								<td className="px-4 py-2">
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
										o.status === "Shipped" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
									}`}>
										{o.status}
									</span>
								</td>
								<td className="px-4 py-2 text-slate-500">{o.date}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
