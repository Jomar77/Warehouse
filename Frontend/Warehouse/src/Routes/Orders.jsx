import { useMemo } from "react";
import { useSessionStorage } from "../utils/useSessionStorage";
import { useLocalStorage } from "../utils/useLocalStorage";
import SearchBar from "../Components/searchbar";
import { SegmentedBar, ToolbarButton } from "../Components/ui/SegmentedBar";
import SortableTh from "../Components/ui/SortableTh";
import ShipOrder from "../Components/orders/ShipOrder";
import ApproveOrder from "../Components/orders/ApproveOrder";

const SAMPLE_ORDERS = [
	{ id: "ORD-1001", customer: "Acme Corp", items: 12, total: 1540.5, status: "Pending", date: "2025-08-01" },
	{ id: "ORD-1002", customer: "Globex", items: 5, total: 420.0, status: "Shipped", date: "2025-08-02" },
	{ id: "ORD-1003", customer: "Soylent", items: 8, total: 899.99, status: "Pending", date: "2025-08-03" },
];

export default function Orders() {
	const [query, setQuery] = useSessionStorage("orders.query", "");
	const [view, setView] = useSessionStorage("orders.view", "list"); // list | ship | approve
	const [sort, setSort] = useLocalStorage("orders.sort", { key: "date", dir: "desc" });

	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return SAMPLE_ORDERS;
		return SAMPLE_ORDERS.filter(
			(o) =>
				o.id.toLowerCase().includes(q) ||
				o.customer.toLowerCase().includes(q) ||
				o.status.toLowerCase().includes(q)
		);
	}, [query]);

	const rows = useMemo(() => {
		const copy = [...filtered];
		copy.sort((a, b) => {
			const dir = sort.dir === "asc" ? 1 : -1;
			const ak = a[sort.key];
			const bk = b[sort.key];
			if (typeof ak === "number" && typeof bk === "number") return (ak - bk) * dir;
			return String(ak).localeCompare(String(bk)) * dir;
		});
		return copy;
	}, [filtered, sort]);

		function toggleSort(key) {
			setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
		}

		return (
			<section className="space-y-4">
				<div className="flex flex-col items-center gap-3">
				<SearchBar value={query} onChange={setQuery} placeholder="Search orders" className="w-full max-w-xl" />
					<SegmentedBar>
						<ToolbarButton label="List" active={view === "list"} onClick={() => setView("list")} />
						<ToolbarButton label="Ship" active={view === "ship"} onClick={() => setView("ship")} />
						<ToolbarButton label="Approve" active={view === "approve"} onClick={() => setView("approve")} />
					</SegmentedBar>
				</div>

				{view === "list" && (
					<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
						<table className="min-w-full text-sm">
							<thead className="bg-slate-100 text-slate-600">
								<tr>
									<SortableTh onClick={() => toggleSort("id")} active={sort.key === "id"} dir={sort.dir} align="left">Order ID</SortableTh>
									<SortableTh onClick={() => toggleSort("customer")} active={sort.key === "customer"} dir={sort.dir} align="left">Customer</SortableTh>
									<SortableTh onClick={() => toggleSort("items")} active={sort.key === "items"} dir={sort.dir} align="right">Items</SortableTh>
									<SortableTh onClick={() => toggleSort("total")} active={sort.key === "total"} dir={sort.dir} align="right">Total</SortableTh>
									<SortableTh onClick={() => toggleSort("status")} active={sort.key === "status"} dir={sort.dir} align="left">Status</SortableTh>
									<SortableTh onClick={() => toggleSort("date")} active={sort.key === "date"} dir={sort.dir} align="left">Date</SortableTh>
								</tr>
							</thead>
							<tbody>
								{rows.map((o) => (
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
				)}

				{view === "ship" && (
					<ShipOrder onCancel={() => setView("list")} options={SAMPLE_ORDERS} />
				)}
				{view === "approve" && (
					<ApproveOrder onCancel={() => setView("list")} pending={SAMPLE_ORDERS.filter((o) => o.status === "Pending")} />
				)}
			</section>
		);
}

 

