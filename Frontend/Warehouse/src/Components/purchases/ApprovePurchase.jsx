import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function ApprovePurchase({ onCancel, submitted = [], onRefresh }) {
  const { authenticatedFetch } = useAuth();
  const [approvingId, setApprovingId] = useState(null);

  const handleApprove = async (purchaseId) => {
    setApprovingId(purchaseId);
    try {
      const res = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Inward/approve/${purchaseId}`, {
        method: "POST"
      });
      if (!res.ok) {
        let msg = "Failed to approve purchase.";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        alert(msg);
      } else {
        alert("Purchase approved.");
        onRefresh && onRefresh();
      }
    } catch (err) {
      alert("Error approving purchase.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Approve Purchase" subtitle="Review and approve submitted POs" onCancel={onCancel} />
      <div className="rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-2 text-left">PO</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-right">Items</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submitted.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                  No submitted POs.
                </td>
              </tr>
            )}
            {submitted.map((p) => {
              // Calculate total cost and total quantity
              const total = p.items?.reduce((sum, item) => sum + (item.unitPrice ?? 0) * (item.quantityOrdered ?? 0), 0) ?? 0;
              const totalQty = p.items?.reduce((sum, item) => sum + (item.quantityOrdered ?? 0), 0) ?? 0;
              // Only approve if all items are present, valid, and fully received
              const canApprove = Array.isArray(p.items)
                && p.items.length > 0
                && p.items.every(
                  item => item.productId
                    && item.quantityOrdered > 0
                    && item.quantityReceived >= item.quantityOrdered
                );
              return (
                <tr key={p.purchaseId} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium text-slate-800">{p.poNumber}</td>
                  <td className="px-4 py-2">{p.supplierName}</td>
                  <td className="px-4 py-2 text-right">{totalQty}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-brand text-white text-xs"
                        disabled={approvingId === p.purchaseId || !canApprove}
                        onClick={() => handleApprove(p.purchaseId)}
                        title={!canApprove ? "Cannot approve: all items must be present and valid." : undefined}
                      >
                        {approvingId === p.purchaseId ? "Approving..." : "Approve"}
                      </button>
                      <button type="button" className="px-3 py-1.5 rounded border border-slate-300 text-xs">Reject</button>
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
