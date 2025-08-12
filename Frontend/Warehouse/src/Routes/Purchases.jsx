const SAMPLE_PURCHASES = [
	{ id: "PO-2001", supplier: "Wayne Supplies", items: 24, cost: 2100.0, status: "Pending", eta: "2025-08-15" },
	{ id: "PO-2002", supplier: "Stark Industries", items: 10, cost: 940.75, status: "Received", eta: "2025-08-09" },
	{ id: "PO-2003", supplier: "Umbrella Corp", items: 50, cost: 5000.0, status: "Pending", eta: "2025-08-20" },
];

export default function Purchases() {
	return (
		<section className="space-y-4">
			<header className="flex items-end justify-between">
				<div>
					<h2 className="text-xl font-semibold text-slate-800">Purchases</h2>
					<p className="text-sm text-slate-500">Sample data only</p>
				</div>
				<button className="px-3 py-2 rounded bg-brand text-white text-sm">Create PO</button>
			</header>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
				<table className="min-w-full text-sm">
					<thead className="bg-slate-100 text-slate-600">
						<tr>
							<th className="px-4 py-2 text-left">PO</th>
							<th className="px-4 py-2 text-left">Supplier</th>
							<th className="px-4 py-2 text-right">Items</th>
							<th className="px-4 py-2 text-right">Cost</th>
							<th className="px-4 py-2 text-left">Status</th>
							<th className="px-4 py-2 text-left">ETA</th>
						</tr>
					</thead>
					<tbody>
						{SAMPLE_PURCHASES.map((po) => (
							<tr key={po.id} className="border-t border-slate-100">
								<td className="px-4 py-2 font-medium text-slate-800">{po.id}</td>
								<td className="px-4 py-2">{po.supplier}</td>
								<td className="px-4 py-2 text-right">{po.items}</td>
								<td className="px-4 py-2 text-right">${po.cost.toFixed(2)}</td>
								<td className="px-4 py-2">
									<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
										po.status === "Received" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
									}`}>
										{po.status}
									</span>
								</td>
								<td className="px-4 py-2 text-slate-500">{po.eta}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
}
