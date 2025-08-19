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
              <th className="px-4 py-2 text-right">Total</th>
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
            {pending.map((o) => (
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
                  ${typeof o.total === "number" ? o.total.toFixed(2) : "0.00"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded bg-brand text-white text-xs"
                      disabled={submittingId === (o.id ?? o.orderId)}
                      onClick={() => handleApprove(o.id ?? o.orderId)}
                    >
                      {submittingId === (o.id ?? o.orderId)
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
