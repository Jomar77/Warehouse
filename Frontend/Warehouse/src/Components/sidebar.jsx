import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
	const navigate = useNavigate();

	function onLogout() {
		// mock logout; no auth state yet
		navigate("/login", { replace: true });
	}

	return (
		<aside className="row-span-2 bg-slate-900 text-white p-4 flex flex-col">
			<div className="flex items-center gap-2 mb-6">
				<div className="h-8 w-8 rounded bg-brand" />
				<h1 className="text-lg font-semibold">Warehouse</h1>
			</div>

			<nav className="space-y-1">
				<NavLink to="/Orders" className={navCls}>Orders</NavLink>
				<NavLink to="/Products" className={navCls}>Products</NavLink>
				<NavLink to="/Purchases" className={navCls}>Purchases</NavLink>
				<NavLink to="/Register" className={navCls}>Register</NavLink>
			</nav>

			<div className="mt-auto pt-4">
				<button
					onClick={onLogout}
					className="w-full rounded bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 text-sm font-medium"
				>
					Logout
				</button>
			</div>
		</aside>
	);
}

function navCls({ isActive }) {
	return [
		"block rounded px-3 py-2 text-sm font-medium",
		isActive
			? "bg-slate-800 text-white"
			: "text-slate-300 hover:text-white hover:bg-slate-800",
	].join(" ");
}
