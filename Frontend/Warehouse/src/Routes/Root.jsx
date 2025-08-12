import { Outlet } from "react-router-dom";
import Sidebar from "../Components/sidebar.jsx";

export default function Root() {
	return (
		<div className="min-h-screen grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr]">
			{/* Sidebar */}
			<Sidebar />

			{/* Topbar */}
			<header className="col-start-2 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
				<div className="text-slate-700">
					<span className="font-medium">Dashboard</span>
				</div>
						<div className="flex items-center gap-3">
					<span className="text-sm text-slate-500">Public mode</span>
							<div className="h-8 w-8 rounded-full bg-brand" />
				</div>
			</header>

			{/* Main content */}
			<main className="col-start-2 p-6 bg-slate-50">
				<Outlet />
			</main>
		</div>
	);
}
