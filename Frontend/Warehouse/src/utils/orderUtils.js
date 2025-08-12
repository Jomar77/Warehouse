/**
 * Utility functions for order management and data processing
 */

/**
 * Calculates the total quantity of items in an order
 * @param {Array} orderItems - Array of order items
 * @returns {number} Total quantity of all items
 */
export const calculateTotalItems = (orderItems) => {
    if (!Array.isArray(orderItems)) return 0;
    return orderItems.reduce((total, item) => total + (item?.quantity || 0), 0);
};

/**
 * Formats a date string for display in US locale
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string or "Invalid Date" if parsing fails
 */
export const formatOrderDate = (dateString) => {
    if (!dateString) return "No Date";
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("en-US");
    } catch {
        return "Invalid Date";
    }
};

/**
 * Gets appropriate CSS classes for order status badges
 * @param {string} orderStatus - The status of the order
 * @returns {string} CSS classes for the status badge
 */
export const getStatusBadgeClass = (orderStatus) => {
    const baseClasses = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";
    
    if (!orderStatus) return `${baseClasses} bg-slate-100 text-slate-700`;
    
    switch (orderStatus.toLowerCase()) {
        case "shipped":
            return `${baseClasses} bg-green-100 text-green-700`;
        case "pending":
            return `${baseClasses} bg-amber-100 text-amber-700`;
        case "cancelled":
        case "canceled":
            return `${baseClasses} bg-red-100 text-red-700`;
        case "processing":
            return `${baseClasses} bg-blue-100 text-blue-700`;
        case "completed":
            return `${baseClasses} bg-emerald-100 text-emerald-700`;
        default:
            return `${baseClasses} bg-slate-100 text-slate-700`;
    }
};

/**
 * Filters orders based on search query
 * @param {Array} orders - Array of order objects
 * @param {string} searchQuery - Search query string
 * @returns {Array} Filtered array of orders
 */
export const filterOrders = (orders, searchQuery) => {
    if (!Array.isArray(orders)) return [];
    if (!searchQuery?.trim()) return orders;
    
    const query = searchQuery.toLowerCase().trim();
    
    return orders.filter((order) => {
        const orderId = order?.orderId?.toString() || "";
        const customerName = order?.customerName?.toLowerCase() || "";
        const status = order?.status?.toLowerCase() || "";
        
        return orderId.includes(query) ||
               customerName.includes(query) ||
               status.includes(query);
    });
};

/**
 * Sorts orders based on specified key and direction
 * @param {Array} orders - Array of order objects to sort
 * @param {string} sortKey - Property name to sort by
 * @param {string} sortDirection - Sort direction ("asc" or "desc")
 * @returns {Array} Sorted array of orders
 */
export const sortOrders = (orders, sortKey, sortDirection = "asc") => {
    if (!Array.isArray(orders)) return [];
    
    const ordersCopy = [...orders];
    const direction = sortDirection === "asc" ? 1 : -1;
    
    return ordersCopy.sort((orderA, orderB) => {
        const valueA = orderA?.[sortKey];
        const valueB = orderB?.[sortKey];
        
        // Handle null/undefined values
        if (valueA == null && valueB == null) return 0;
        if (valueA == null) return direction;
        if (valueB == null) return -direction;
        
        // Handle date sorting
        if (sortKey === "orderDate") {
            const dateA = new Date(valueA);
            const dateB = new Date(valueB);
            return (dateA.getTime() - dateB.getTime()) * direction;
        }
        
        // Handle numeric sorting
        if (typeof valueA === "number" && typeof valueB === "number") {
            return (valueA - valueB) * direction;
        }
        
        // Handle string sorting (case-insensitive)
        const stringA = String(valueA).toLowerCase();
        const stringB = String(valueB).toLowerCase();
        return stringA.localeCompare(stringB) * direction;
    });
};

/**
 * Validates if an order object has required properties
 * @param {object} order - Order object to validate
 * @returns {boolean} True if order is valid, false otherwise
 */
export const isValidOrder = (order) => {
    if (!order || typeof order !== "object") return false;
    
    return order.hasOwnProperty("orderId") &&
           order.hasOwnProperty("customerName") &&
           order.hasOwnProperty("orderDate") &&
           order.hasOwnProperty("status");
};

/**
 * Gets pending orders from a list of orders
 * @param {Array} orders - Array of order objects
 * @returns {Array} Array of orders with "pending" status
 */
export const getPendingOrders = (orders) => {
    if (!Array.isArray(orders)) return [];
    
    return orders.filter((order) => 
        order?.status?.toLowerCase() === "pending"
    );
};

/**
 * Groups orders by their status
 * @param {Array} orders - Array of order objects
 * @returns {object} Object with status as keys and arrays of orders as values
 */
export const groupOrdersByStatus = (orders) => {
    if (!Array.isArray(orders)) return {};
    
    return orders.reduce((groups, order) => {
        const status = order?.status?.toLowerCase() || "unknown";
        if (!groups[status]) {
            groups[status] = [];
        }
        groups[status].push(order);
        return groups;
    }, {});
};