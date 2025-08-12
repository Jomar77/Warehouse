import { useMemo } from "react";
import { useSessionStorage } from "../utils/useSessionStorage";
import { useLocalStorage } from "../utils/useLocalStorage";
import SearchBar from "../Components/searchbar";
import { SegmentedBar, ToolbarButton } from "../Components/ui/SegmentedBar";
import SortableTh from "../Components/ui/SortableTh";
import CreatePurchase from "../Components/purchases/CreatePurchase";
import ReceiveStock from "../Components/purchases/ReceiveStock";
import ApprovePurchase from "../Components/purchases/ApprovePurchase";

const SAMPLE_PURCHASES = [
	{ id: "PO-2001", supplier: "Northwind Traders", items: 7, total: 1200.0, status: "Submitted", date: "2025-08-01" },
	{ id: "PO-2002", supplier: "Contoso Supplies", items: 3, total: 350.25, status: "Approved", date: "2025-08-02" },
	{ id: "PO-2003", supplier: "Tailwind Parts", items: 12, total: 2890.99, status: "Received", date: "2025-08-03" },
];

export default function Purchases() {
		const [query, setQuery] = useSessionStorage("purchases.query", "");
		const [view, setView] = useSessionStorage("purchases.view", "list"); // 'list' | 'create' | 'receive' | 'approve'

		const [sort, setSort] = useLocalStorage("purchases.sort", { key: "date", dir: "desc" }); // {key, dir}

		const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return SAMPLE_PURCHASES;
		return SAMPLE_PURCHASES.filter(
			(p) =>
				p.id.toLowerCase().includes(q) ||
				p.supplier.toLowerCase().includes(q) ||
				p.status.toLowerCase().includes(q)
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
		<section className="space-y-5">
			{/* Toolbar */}
					<div className="flex flex-col items-center gap-3">
				{/* Search */}
					<SearchBar value={query} onChange={setQuery} placeholder="Search purchases" className="w-full max-w-xl" />

				{/* Segmented actions bar */}
						<SegmentedBar>
							<ToolbarButton label="Create Purchase" active={view === "create"} onClick={() => setView("create")} />
							<ToolbarButton label="Received Stock" active={view === "receive"} onClick={() => setView("receive")} />
							<ToolbarButton label="Approve Purchase" active={view === "approve"} onClick={() => setView("approve")} />
						</SegmentedBar>
			</div>

			{/* Content area: list or mode-specific UI */}
			{view === "list" && (
				<>
					<header className="flex items-end justify-between">
						<div>
							<h2 className="text-xl font-semibold text-slate-800">Purchases</h2>
							<p className="text-sm text-slate-500">Sample data only</p>
						</div>
						<button
							className="px-3 py-2 rounded bg-brand text-white text-sm"
							onClick={() => setView("create")}
						>
							New Purchase
						</button>
					</header>

								<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
						<table className="min-w-full text-sm">
							<thead className="bg-slate-100 text-slate-600">
								<tr>
												<SortableTh onClick={() => toggleSort("id")} active={sort.key === "id"} dir={sort.dir} align="left">PO</SortableTh>
												<SortableTh onClick={() => toggleSort("supplier")} active={sort.key === "supplier"} dir={sort.dir} align="left">Supplier</SortableTh>
												<SortableTh onClick={() => toggleSort("items")} active={sort.key === "items"} dir={sort.dir} align="right">Items</SortableTh>
												<SortableTh onClick={() => toggleSort("total")} active={sort.key === "total"} dir={sort.dir} align="right">Total</SortableTh>
												<SortableTh onClick={() => toggleSort("status")} active={sort.key === "status"} dir={sort.dir} align="left">Status</SortableTh>
												<SortableTh onClick={() => toggleSort("date")} active={sort.key === "date"} dir={sort.dir} align="left">Date</SortableTh>
								</tr>
							</thead>
										<tbody>
											{rows.map((p) => (
									<tr key={p.id} className="border-t border-slate-100">
										<td className="px-4 py-2 font-medium text-slate-800">{p.id}</td>
										<td className="px-4 py-2">{p.supplier}</td>
										<td className="px-4 py-2 text-right">{p.items}</td>
										<td className="px-4 py-2 text-right">${p.total.toFixed(2)}</td>
										<td className="px-4 py-2">
											<span
												className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
													p.status === "Approved"
														? "bg-green-100 text-green-700"
														: p.status === "Submitted"
														? "bg-amber-100 text-amber-700"
														: "bg-slate-100 text-slate-700"
												}`}
											>
												{p.status}
											</span>
										</td>
										<td className="px-4 py-2 text-slate-500">{p.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

						{view === "create" && <CreatePurchase onCancel={() => setView("list")} />}
						{view === "receive" && (
							<ReceiveStock onCancel={() => setView("list")} options={SAMPLE_PURCHASES} />
						)}
						{view === "approve" && (
							<ApprovePurchase onCancel={() => setView("list")} submitted={SAMPLE_PURCHASES.filter((p) => p.status === "Submitted")} />
						)}
		</section>
);
}
