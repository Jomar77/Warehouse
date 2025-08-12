import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

import SearchBar from "../Components/searchbar";
import { SegmentedBar, ToolbarButton } from "../Components/ui/SegmentedBar";
import SortableTh from "../Components/ui/SortableTh";
import ShipOrder from "../Components/orders/ShipOrder";
import ApproveOrder from "../Components/orders/ApproveOrder";

// Import utility functions
import {
    calculateTotalItems,
    formatOrderDate,
    getStatusBadgeClass,
    filterOrders,
    sortOrders,
    getPendingOrders
} from "../utils/orderUtils";

/**
 * Orders component that displays and manages customer orders
 * Fetches data from /api/Outward/pending-orders endpoint
 */
export default function Orders() {
    const { authenticatedFetch } = useAuth();
    const [query, setQuery] = useState("");
    const [view, setView] = useState("list"); // list | ship | approve
    const [sort, setSort] = useState({ key: "orderDate", dir: "desc" });
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    /**
     * Fetches pending orders from the API
     */
    const fetchPendingOrders = async () => {
        try {
            setIsLoading(true);
            setError("");
            
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await authenticatedFetch(`${baseUrl}/api/Outward/pending-orders`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status}`);
            }
            
            const data = await response.json();
            setOrders(data || []);
        } catch (fetchError) {
            console.error("Error fetching pending orders:", fetchError);
            setError("Failed to load orders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchPendingOrders();
    }, []);

    /**
     * Filters orders based on search query using utility function
     */
    const filteredOrders = useMemo(() => {
        return filterOrders(orders, query);
    }, [query, orders]);

    /**
     * Sorts filtered orders based on current sort configuration using utility function
     */
    const sortedOrders = useMemo(() => {
        return sortOrders(filteredOrders, sort.key, sort.dir);
    }, [filteredOrders, sort]);

    /**
     * Toggles sort direction or sets new sort key
     */
    const handleSortToggle = (sortKey) => {
        setSort((currentSort) => 
            currentSort.key === sortKey 
                ? { key: sortKey, dir: currentSort.dir === "asc" ? "desc" : "asc" }
                : { key: sortKey, dir: "asc" }
        );
    };

    if (isLoading) {
        return (
            <section className="space-y-4">
                <div className="flex items-center justify-center p-8">
                    <div className="text-slate-500">Loading orders...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="text-red-700">{error}</div>
                    <button 
                        onClick={fetchPendingOrders}
                        className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {/* Search and Navigation */}
            <div className="flex flex-col items-center gap-3">
                <SearchBar 
                    value={query} 
                    onChange={setQuery} 
                    placeholder="Search orders by ID, customer, or status" 
                    className="w-full max-w-xl" 
                />
                <SegmentedBar>
                    <ToolbarButton label="List" active={view === "list"} onClick={() => setView("list")} />
                    <ToolbarButton label="Ship" active={view === "ship"} onClick={() => setView("ship")} />
                    <ToolbarButton label="Approve" active={view === "approve"} onClick={() => setView("approve")} />
                </SegmentedBar>
            </div>

            {/* Orders List View */}
            {view === "list" && (
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <SortableTh 
                                    onClick={() => handleSortToggle("orderId")} 
                                    active={sort.key === "orderId"} 
                                    dir={sort.dir} 
                                    align="left"
                                >
                                    Order ID
                                </SortableTh>
                                <SortableTh 
                                    onClick={() => handleSortToggle("customerName")} 
                                    active={sort.key === "customerName"} 
                                    dir={sort.dir} 
                                    align="left"
                                >
                                    Customer
                                </SortableTh>
                                <th className="px-4 py-2 text-right">Total Items</th>
                                <SortableTh 
                                    onClick={() => handleSortToggle("status")} 
                                    active={sort.key === "status"} 
                                    dir={sort.dir} 
                                    align="left"
                                >
                                    Status
                                </SortableTh>
                                <SortableTh 
                                    onClick={() => handleSortToggle("orderDate")} 
                                    active={sort.key === "orderDate"} 
                                    dir={sort.dir} 
                                    align="left"
                                >
                                    Order Date
                                </SortableTh>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                        {query ? "No orders match your search." : "No pending orders found."}
                                    </td>
                                </tr>
                            ) : (
                                sortedOrders.map((order) => (
                                    <tr key={order.orderId} className="border-t border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {order.orderId}
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.customerName || "Unknown Customer"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {calculateTotalItems(order.items)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={getStatusBadgeClass(order.status)}>
                                                {order.status || "Unknown"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {formatOrderDate(order.orderDate)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Ship Orders View */}
            {view === "ship" && (
                <ShipOrder 
                    onCancel={() => setView("list")} 
                    options={orders} 
                    onRefresh={fetchPendingOrders}
                />
            )}

            {/* Approve Orders View */}
            {view === "approve" && (
                <ApproveOrder 
                    onCancel={() => setView("list")} 
                    pending={getPendingOrders(orders)}
                    onRefresh={fetchPendingOrders}
                />
            )}
        </section>
    );
}



