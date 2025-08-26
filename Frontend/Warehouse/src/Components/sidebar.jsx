import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Assumes user info is stored in AuthContext

    function onLogout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        navigate("/login");
    }

    function navCls({ isActive }) {
        return [
            "block px-3 py-2 text-sm rounded transition-colors",
            isActive
                ? "bg-brand text-white"
                : "text-slate-700 hover:bg-slate-100"
        ].join(" ");
    }

    return (
        <aside className="row-span-2 bg-white border-r border-slate-200 p-4 flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
                <div className="size-8 rounded bg-brand" />
                <span className="font-semibold text-slate-800">Warehouse</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
                <NavLink to="/Orders" className={navCls}>Orders</NavLink>
                <NavLink to="/Products" className={navCls}>Products</NavLink>
                <NavLink to="/Purchases" className={navCls}>Purchases</NavLink>
                <NavLink to="/Suppliers" className={navCls}>Suppliers</NavLink>
            </nav>

            {/* User info and logout */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                        {user?.name ? `Logged in as ${user.name}` : "Logged in"}
                    </span>
                </div>
                <button 
                    onClick={onLogout}
                    className="w-full px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
}
