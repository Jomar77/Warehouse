import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import SectionHeader from "./SectionHeader";

export default function ShipOrder({ onCancel, options = [], onRefresh }) {
  const { authenticatedFetch } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [shipQuantities, setShipQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch order details when order is selected
  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    } else {
      setOrderItems([]);
      setShipQuantities({});
    }
  }, [selectedOrderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Outward/pending-orders/${orderId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setOrderItems(data.items || []);

      // Initialize ship quantities with ordered quantities
      const initialQuantities = {};
      data.items?.forEach((item) => {
        initialQuantities[item.productId] = item.orderedQuantity;
      });
      setShipQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Failed to load order details");
      setOrderItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const numQuantity = parseInt(quantity) || 0;
    setShipQuantities((prev) => ({
      ...prev,
      [productId]: numQuantity,
    }));
  };

  const handleCreateShipment = async () => {
    if (!selectedOrderId) {
      alert("Please select an order to ship");
      return;
    }

    const shipmentItems = orderItems
      .map((item) => ({
        productId: item.productId,
        quantityToShip: shipQuantities[item.productId] || 0,
      }))
      .filter((item) => item.quantityToShip > 0);

    if (shipmentItems.length === 0) {
      alert("Please specify quantities to ship");
      return;
    }

    try {
      setSubmitting(true);

      const shipmentData = {
        orderId: parseInt(selectedOrderId),
        items: shipmentItems,
      };

      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Outward/ship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shipmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create shipment");
      }

      // Success
      setShowSuccess(true);
      onRefresh?.();

      // Hide success message and return to list after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onCancel();
      }, 2000);
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert(error.message || "Failed to create shipment");
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
            ✓ Shipment Created Successfully!
          </div>
          <div className="text-green-600 text-sm">
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
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            disabled={submitting}
          >
            <option value="">Choose an order...</option>
            {options.map((order) => (
              <option key={order.orderId} value={order.orderId}>
                Order #{order.orderId} -{" "}
                {order.customerName || "Unknown Customer"}
              </option>
            ))}
          </select>
        </div>

        {/* Order Items Table */}
        {selectedOrderId && (
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Ordered</th>
                  <th className="px-3 py-2 text-right">Available</th>
                  <th className="px-3 py-2 text-right">Ship Qty</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      Loading order details...
                    </td>
                  </tr>
                ) : orderItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                      No items found for this order
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item) => (
                    <tr key={item.productId} className="border-t">
                      <td className="px-3 py-2">
                        {item.sku || `SKU-${item.productId}`}
                      </td>
                      <td className="px-3 py-2">
                        {item.productName || "Unknown Product"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.orderedQuantity}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.availableQuantity || 0}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={shipQuantities[item.productId] || 0}
                          onChange={(e) =>
                            handleQuantityChange(item.productId, e.target.value)
                          }
                          className="w-24 rounded border border-slate-300 px-2 py-1 text-right focus:border-blue-500 focus:outline-none"
                          disabled={submitting}
                        />
                      </td>
                    </tr>
                  ))
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
            disabled={!selectedOrderId || submitting || orderItems.length === 0}
            className="px-3 py-2 rounded bg-brand text-white text-sm hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}
