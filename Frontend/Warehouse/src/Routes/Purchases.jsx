
import { useState, useEffect, useMemo } from "react";
import SearchBar from "../Components/searchbar";
import { SegmentedBar, ToolbarButton } from "../Components/ui/SegmentedBar";
import SortableTh from "../Components/ui/SortableTh";
import CreatePurchase from "../Components/purchases/CreatePurchase";
import ReceiveStock from "../Components/purchases/ReceiveStock";
import ApprovePurchase from "../Components/purchases/ApprovePurchase";
import { useAuth } from "../Context/AuthContext";


export default function Purchases() {
	const { authenticatedFetch } = useAuth();
	const [query, setQuery] = useState("");
	const [view, setView] = useState("list"); // 'list' | 'receive' | 'approve'
	const [sort, setSort] = useState({ key: "orderDate", dir: "desc" });
	const [purchases, setPurchases] = useState([]);
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const fetchPurchases = async () => {
		setLoading(true);
		try {
			const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Inward/pending-purchases`);
			const data = await response.json();
			setPurchases(data || []);
		} catch (error) {
			console.error("Failed to fetch purchases:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPurchases();
	}, []);

	// Search and filter
	const filtered = useMemo(() => {
		const q = query.toLowerCase().trim();
		if (!q) return purchases;
		return purchases.filter(
			(p) =>
				p.poNumber.toLowerCase().includes(q) ||
				p.supplierName.toLowerCase().includes(q) ||
				(p.status || "").toLowerCase().includes(q)
		);
	}, [query, purchases]);

	// Sort
	const sorted = useMemo(() => {
		const copy = [...filtered];
		copy.sort((a, b) => {
			const dir = sort.dir === "asc" ? 1 : -1;
			let ak = a[sort.key];
			let bk = b[sort.key];
			if (sort.key === "orderDate" || sort.key === "expectedDelivery") {
				ak = new Date(ak);
				bk = new Date(bk);
				return (ak - bk) * dir;
			}
			return String(ak).localeCompare(String(bk)) * dir;
		});
		return copy;
	}, [filtered, sort]);

	function handleSortToggle(key) {
		setSort((prev) =>
			prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
		);
	}

	// Approve view: only submitted purchases
	const submittedPurchases = sorted.filter((p) => (p.status || "").toLowerCase() === "submitted");

	if (loading) {
		return (
			<section className="space-y-4">
				<div className="flex items-center justify-center p-8">
					<div className="text-slate-500">Loading purchases...</div>
				</div>
			</section>
		);
	}

	return (
		<section className="space-y-5">
			{/* Toolbar */}
					<div className="flex flex-col items-center gap-3">
						{/* Search */}
						<SearchBar value={query} onChange={setQuery} placeholder="Search purchases" className="w-full max-w-xl" />
						{/* Segmented actions bar */}
						<SegmentedBar>
							<ToolbarButton label="List" active={view === "list"} onClick={() => setView("list")} />
							<ToolbarButton label="Received Stock" active={view === "receive"} onClick={() => setView("receive")} />
							<ToolbarButton label="Approve Purchase" active={view === "approve"} onClick={() => setView("approve")} />
						</SegmentedBar>
						{/* Create Purchase Button */}
						<button
							type="button"
							className="px-4 py-2 rounded bg-brand text-white text-sm mt-2"
							onClick={() => setShowCreateModal(true)}
							disabled={creating}
						>
							Create Purchase
						</button>
					</div>

			{/* List View */}
			{view === "list" && (
				<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
					<table className="min-w-full text-sm">
						<thead className="bg-slate-100 text-slate-600">
							<tr>
								<SortableTh onClick={() => handleSortToggle("poNumber")} active={sort.key === "poNumber"} dir={sort.dir} align="left">PO</SortableTh>
								<SortableTh onClick={() => handleSortToggle("supplierName")} active={sort.key === "supplierName"} dir={sort.dir} align="left">Supplier</SortableTh>
								<th className="px-4 py-2 text-right">Items</th>
								<SortableTh onClick={() => handleSortToggle("status")} active={sort.key === "status"} dir={sort.dir} align="left">Status</SortableTh>
								<SortableTh onClick={() => handleSortToggle("orderDate")} active={sort.key === "orderDate"} dir={sort.dir} align="left">Order Date</SortableTh>
								<SortableTh onClick={() => handleSortToggle("expectedDelivery")} active={sort.key === "expectedDelivery"} dir={sort.dir} align="left">Expected Delivery</SortableTh>
							</tr>
						</thead>
						<tbody>
							{sorted.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-4 py-8 text-center text-slate-500">
										{query ? "No purchases match your search." : "No pending purchases found."}
									</td>
								</tr>
							) : (
								sorted.map((p) => (
									<tr key={p.purchaseId} className="border-t border-slate-100">
										<td className="px-4 py-2 font-medium text-slate-800">{p.poNumber}</td>
										<td className="px-4 py-2">{p.supplierName}</td>
										<td className="px-4 py-2 text-right">{p.items?.length ?? 0}</td>
										<td className="px-4 py-2">
											<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
												p.status === "Approved"
													? "bg-green-100 text-green-700"
													: p.status === "Submitted"
													? "bg-amber-100 text-amber-700"
													: "bg-slate-100 text-slate-700"
											}`}>
												{p.status}
											</span>
										</td>
										<td className="px-4 py-2 text-slate-500">{p.orderDate?.slice(0, 10)}</td>
										<td className="px-4 py-2 text-slate-500">{p.expectedDelivery}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}


					{/* Create Purchase Modal */}
					{showCreateModal && (
						<CreatePurchase
							open={showCreateModal}
							onClose={() => setShowCreateModal(false)}
							onCreated={() => {
								setShowCreateModal(false);
								fetchPurchases();
							}}
							creating={creating}
							setCreating={setCreating}
						/>
					)}

			{/* Receive Stock View */}
			{view === "receive" && (
				<ReceiveStock
					onCancel={() => setView("list")}
					options={sorted}
					onRefresh={fetchPurchases}
				/>
			)}

			{/* Approve Purchase View */}
			{view === "approve" && (
				<ApprovePurchase
					onCancel={() => setView("list")}
					submitted={submittedPurchases}
					onRefresh={fetchPurchases}
				/>
			)}
		</section>
	);
}
