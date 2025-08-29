
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import SectionHeader from "./SectionHeader";


export default function ShipOrder({ onCancel, onRefresh }) {
  const { authenticatedFetch } = useAuth();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [shipQuantities, setShipQuantities] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Fetch pending orders on mount
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Outward/pending-orders`);
        if (!response.ok) throw new Error("Failed to fetch pending orders");
        const data = await response.json();
        setPendingOrders(data ?? []);
      } catch (err) {
        setErrorMsg("Error loading pending orders");
      }
    };
    fetchPendingOrders();
  }, [authenticatedFetch]);

  // Fetch order details when order is selected
  useEffect(() => {
    if (!selectedOrderId) {
      setOrderItems([]);
      setShipQuantities({});
      setValidationErrors({});
      return;
    }
    setLoading(true);
    setErrorMsg("");
    authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Outward/pending-orders/${selectedOrderId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        setOrderItems(data.items ?? []);
        // Initialize ship quantities to 0
        const initialQuantities = {};
        (data.items ?? []).forEach(item => {
          initialQuantities[item.productId] = 0;
        });
        setShipQuantities(initialQuantities);
        setValidationErrors({});
      })
      .catch(() => {
        setErrorMsg("Error loading order details");
        setOrderItems([]);
      })
      .finally(() => setLoading(false));
  }, [selectedOrderId, authenticatedFetch]);

  // Handle quantity change and validation
  const handleQuantityChange = (productId, value) => {
    const val = Number(value);
    setShipQuantities(q => ({ ...q, [productId]: val }));
    // Validate
    const item = orderItems.find(i => i.productId === productId);
    if (!item) return;
    const ordered = item.quantityOrdered ?? 0;
    const shipped = item.quantitySent ?? 0;
    const available = item.quantityOnHand ?? 0;
    const remaining = ordered - shipped;
    let error = "";
    if (val < 0) error = "Cannot ship negative quantity";
    else if (val > remaining) error = `Cannot ship more than remaining (${remaining})`;
    else if (val > available) error = `Cannot ship more than available (${available})`;
    setValidationErrors(e => ({ ...e, [productId]: error }));
  };

  // Handle shipment creation
  const handleCreateShipment = async () => {
    setSubmitting(true);
    setErrorMsg("");
    // Validate all quantities
    const errors = {};
    orderItems.forEach(item => {
      const val = Number(shipQuantities[item.productId] ?? 0);
      const ordered = item.quantityOrdered ?? 0;
      const shipped = item.quantitySent ?? 0;
      const available = item.quantityOnHand ?? 0;
      const remaining = ordered - shipped;
      if (val < 0) errors[item.productId] = "Cannot ship negative quantity";
      else if (val > remaining) errors[item.productId] = `Cannot ship more than remaining (${remaining})`;
      else if (val > available) errors[item.productId] = `Cannot ship more than available (${available})`;
    });
    setValidationErrors(errors);
    if (Object.values(errors).some(e => e)) {
      setSubmitting(false);
      return;
    }
    // Prepare payload
    const itemsToShip = orderItems
      .filter(item => (shipQuantities[item.productId] ?? 0) > 0)
      .map(item => ({
        productId: item.productId,
        quantityToShip: Number(shipQuantities[item.productId])
      }));
    if (itemsToShip.length === 0) {
      setErrorMsg("No items selected to ship");
      setSubmitting(false);
      return;
    }
    const payload = { orderId: selectedOrderId, items: itemsToShip };
    console.debug("ShipOrder payload:", payload);
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Outward/ship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
      if (!response.ok) {
        let errorMsg = "Failed to create shipment";
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
        } catch {}
        setErrorMsg(errorMsg);
        return;
      }
      setShowSuccess(true);
      await onRefresh?.();
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedOrderId("");
        setOrderItems([]);
        setShipQuantities({});
        setValidationErrors({});
        setErrorMsg("");
        onCancel?.();
      }, 1500);
    } catch (err) {
      setErrorMsg(err?.message || "Error creating shipment");
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="space-y-4">
        <SectionHeader
          title="Ship Order"
          subtitle="Fulfill items and create a shipment"
          onCancel={onCancel}
        />
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
          <div className="text-green-600 text-lg font-medium mb-2">
            ✓ Order shipped successfully!
          </div>
          <div className="text-green-600 text-sm">
            Stock has been validated and deducted automatically.
          </div>
          <div className="text-green-600 text-xs mt-2">
            Returning to orders list...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Ship Order"
        subtitle="Fulfill items and create a shipment"
        onCancel={onCancel}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        {/* Order Selection Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="orderSelect"
            className="block text-sm font-medium text-slate-700"
          >
            Select Order
          </label>
          <select
            id="orderSelect"
            value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            disabled={submitting}
          >
            <option value="">Choose an order...</option>
            {pendingOrders
              .filter(order => order.status !== "Shipped")
              .map(order => (
                <option key={order.orderId ?? order.id} value={order.orderId ?? order.id}>
                  Order #{order.orderId ?? order.id} - {order.customerName ?? order.customer}
                </option>
              ))}
          </select>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="text-red-600 text-sm mb-2">{errorMsg}</div>
        )}

        {/* Order Items Table */}
        {selectedOrderId && (
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Ordered</th>
                  <th className="px-3 py-2 text-right">Shipped</th>
                  <th className="px-3 py-2 text-right">Available</th>
                  <th className="px-3 py-2 text-right">Ship Qty</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                      Loading order details...
                    </td>
                  </tr>
                ) : orderItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                      No items found for this order
                    </td>
                  </tr>
                ) : orderItems.every(item => ((item.quantityOrdered ?? 0) - (item.quantitySent ?? 0)) <= 0) ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-green-600 font-medium">
                      All items fully shipped.
                    </td>
                  </tr>
                ) : (
                  orderItems.map(item => {
                    const ordered = item.quantityOrdered ?? 0;
                    const shipped = item.quantitySent ?? 0;
                    const available = item.quantityOnHand ?? 0;
                    const remaining = ordered - shipped;
                    const isFullyShipped = remaining <= 0;
                    return (
                      <tr key={item.productId} className="border-t">
                        <td className="px-3 py-2">{item.sku || `SKU-${item.productId}`}</td>
                        <td className="px-3 py-2">{item.productName || "Unknown Product"}</td>
                        <td className="px-3 py-2 text-right">{ordered}</td>
                        <td className="px-3 py-2 text-right">{shipped}</td>
                        <td className="px-3 py-2 text-right">{available}</td>
                        <td className="px-3 py-2 text-right">
                          {isFullyShipped ? (
                            <span className="text-xs text-green-600">Fully Shipped</span>
                          ) : (
                            <>
                              <input
                                type="number"
                                min="0"
                                max={Math.min(remaining, available)}
                                value={shipQuantities[item.productId] ?? 0}
                                onChange={e => handleQuantityChange(item.productId, e.target.value)}
                                className={`w-24 rounded border border-slate-300 px-2 py-1 text-right focus:border-blue-500 focus:outline-none ${validationErrors[item.productId] ? 'border-red-500' : ''}`}
                                disabled={submitting}
                              />
                              {validationErrors[item.productId] && (
                                <div className="text-xs text-red-600 mt-1">{validationErrors[item.productId]}</div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded border border-slate-300 text-sm hover:bg-slate-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateShipment}
            disabled={!selectedOrderId || submitting || orderItems.length === 0 || orderItems.every(item => ((item.quantityOrdered ?? 0) - (item.quantitySent ?? 0)) <= 0)}
            className="px-3 py-2 rounded bg-brand text-white text-sm hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Shipping..." : "Ship Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
