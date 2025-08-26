import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

import SearchBar from "../Components/searchbar";
import { SegmentedBar, ToolbarButton } from "../Components/ui/SegmentedBar";
import SortableTh from "../Components/ui/SortableTh";
import ShipOrder from "../Components/orders/ShipOrder";
import ApproveOrder from "../Components/orders/ApproveOrder";
import CreateOrderModal from "../Components/orders/CreateOrderModal";

// Import utility functions
import {
    calculateTotalItems,
    formatOrderDate,
    getStatusBadgeClass,
    filterOrders,
    sortOrders,
    getPendingOrders
} from "../utils/orderUtils";

export default function Orders() {
    const { authenticatedFetch } = useAuth();
    const [query, setQuery] = useState("");
    const [view, setView] = useState("list");
    const [sort, setSort] = useState({ key: "orderDate", dir: "desc" });
    const [statusFilter, setStatusFilter] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchOrders = () => {
        setLoading(true);
        authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Outward/pending-orders`)
            .then(response => response.json())
            .then(data => {
                setOrders(data || []);
            })
            .catch(error => {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Get unique statuses from orders
    const uniqueStatuses = useMemo(() => {
        const statuses = orders
            .map(order => order.status)
            .filter(status => status && status.trim() !== "")
            .filter((status, index, array) => array.indexOf(status) === index)
            .sort();
        return statuses;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let filtered = filterOrders(orders, query);
        
        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(order => 
                order.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }
        
        return filtered;
    }, [query, orders, statusFilter]);
    const sortedOrders = useMemo(() => sortOrders(filteredOrders, sort.key, sort.dir), [filteredOrders, sort]);

    const handleSortToggle = (sortKey) => {
        setSort(prev => 
            prev.key === sortKey 
                ? { key: sortKey, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key: sortKey, dir: "asc" }
        );
    };

    const handleCreateOrder = ({ customerName, items, authenticatedFetch }) => {
        setCreating(true);
        return authenticatedFetch(
            `${import.meta.env.VITE_API_URL}/api/Order`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ customerName, items })
            }
        )
            .then(response => {
                if (!response.ok) {
                    return response.json()
                        .then(error => {
                            throw new Error(error.message || "Failed to create order");
                        })
                        .catch(() => {
                            throw new Error("Failed to create order");
                        });
                }
                return fetchOrders();
            })
            .then(() => {
                alert("Order created successfully!");
            })
            .catch(error => {
                alert(error.message || "Error creating order");
            })
            .finally(() => {
                setCreating(false);
            });
    };

    if (loading) {
        return (
            <section className="space-y-4">
                <div className="flex items-center justify-center p-8">
                    <div className="text-slate-500">Loading orders...</div>
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
                
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Statuses</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                
                <SegmentedBar>
                    <ToolbarButton label="List" active={view === "list"} onClick={() => setView("list")} />
                    <ToolbarButton label="Ship" active={view === "ship"} onClick={() => setView("ship")} />
                    <ToolbarButton label="Approve" active={view === "approve"} onClick={() => setView("approve")} />
                </SegmentedBar>
                {/* Create Order Button */}
                <button
                    type="button"
                    className="px-4 py-2 rounded bg-brand text-white text-sm mt-2"
                    onClick={() => setShowCreateModal(true)}
                    disabled={creating}
                >
                    Create Order
                </button>
            </div>

            <CreateOrderModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateOrder}
            />

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
                    onRefresh={fetchOrders}
                />
            )}

            {/* Approve Orders View */}
            {view === "approve" && (
                <ApproveOrder 
                    onCancel={() => setView("list")} 
                    pending={getPendingOrders(orders)}
                    onRefresh={fetchOrders}
                />
            )}
        </section>
    );
}



