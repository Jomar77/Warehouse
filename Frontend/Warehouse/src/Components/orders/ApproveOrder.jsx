import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import SectionHeader from "./SectionHeader";

export default function ApproveOrder({ onCancel, pending = [], onRefresh }) {
  const { authenticatedFetch } = useAuth();
  const [submittingId, setSubmittingId] = useState(null);

  const handleApprove = async (orderId) => {
    setSubmittingId(orderId);
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Outward/approve/${orderId}`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      );
      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to approve order");
        return;
      }
      // Optionally handle response data here
      await onRefresh?.();
      alert("Order approved!");
    } catch (err) {
      alert("Error approving order");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Approve Order"
        subtitle="Review and approve pending orders"
        onCancel={onCancel}
      />
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-right">Items</th>
              <th className="px-4 py-2 text-right">Shipped Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-slate-500"
                  colSpan={5}
                >
                  No pending orders.
                </td>
              </tr>
            )}
            {pending.map((o) => {
              // Calculate shipping status
              const totalOrdered = o.items?.reduce((sum, item) => sum + (item.quantityOrdered || 0), 0) || 0;
              const totalSent = o.items?.reduce((sum, item) => sum + (item.quantitySent || 0), 0) || 0;
              const isFullyShipped = totalOrdered > 0 && totalSent >= totalOrdered;
              const isPartiallyShipped = totalSent > 0 && totalSent < totalOrdered;
              
              return (
                <tr
                  key={o.id ?? o.orderId}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-2 font-medium text-slate-800">
                    {o.id ?? o.orderId}
                  </td>
                  <td className="px-4 py-2">{o.customer ?? o.customerName}</td>
                  <td className="px-4 py-2 text-right">
                    {Array.isArray(o.items) ? o.items.length : o.items ?? 0}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="text-xs">
                      <div className={`font-medium ${isFullyShipped ? 'text-green-600' : isPartiallyShipped ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {totalSent}/{totalOrdered} shipped
                      </div>
                      <div className="text-gray-500">
                        {o.status === 'Shipped' ? 'Auto-shipped' : isFullyShipped ? 'Ready to approve' : isPartiallyShipped ? 'Partially shipped' : 'Not shipped'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded text-white text-xs ${
                          o.status === 'Shipped'
                            ? 'bg-green-600 hover:bg-green-700'
                            : isFullyShipped 
                            ? 'bg-brand hover:bg-brand/90' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={o.status === 'Shipped' || (!isFullyShipped || submittingId === (o.id ?? o.orderId))}
                        onClick={() => isFullyShipped && o.status !== 'Shipped' && handleApprove(o.id ?? o.orderId)}
                        title={
                          o.status === 'Shipped' 
                            ? 'Order already shipped automatically' 
                            : !isFullyShipped 
                            ? 'Order must be fully shipped before approval' 
                            : ''
                        }
                      >
                        {o.status === 'Shipped' 
                          ? '✓ Shipped'
                          : submittingId === (o.id ?? o.orderId)
                          ? "Approving..."
                          : "Approve"}
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded border border-slate-300 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
