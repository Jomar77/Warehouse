import SectionHeader from "./SectionHeader";
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function ReceiveStock({ onCancel, options = [], onRefresh }) {
  const [selectedPO, setSelectedPO] = useState("");
  const [receiptItems, setReceiptItems] = useState({});
  const [posting, setPosting] = useState(false);
  const { authenticatedFetch } = useAuth();

  const po = options.find(p => String(p.purchaseId) === String(selectedPO));
  const items = po?.items || [];

  const handleReceiptChange = (productId, value) => {
    setReceiptItems(prev => ({ ...prev, [productId]: value }));
  };

  const handlePostReceipt = async () => {
    if (!selectedPO || items.length === 0) return;
    setPosting(true);
    try {
      const payload = {
        purchaseId: Number(selectedPO),
        items: items
          .filter(item => receiptItems[item.productId] && Number(receiptItems[item.productId]) > 0)
          .map(item => ({
            productId: item.productId,
            quantityReceived: Number(receiptItems[item.productId])
          }))
      };
      if (payload.items.length === 0) {
        alert("Enter at least one received quantity.");
        setPosting(false);
        return;
      }
      const res = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Inward/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let msg = "Failed to post receipt.";
        try {
          const err = await res.json();
          msg = err.message || msg;
        } catch {}
        alert(msg);
      } else {
        alert("Receipt posted successfully.");
        onRefresh && onRefresh();
        onCancel();
      }
    } catch (err) {
      alert("Error posting receipt.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader title="Receive Stock" subtitle="Record items received against a PO" onCancel={onCancel} />
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="fle">
          <div>
            <label className="block text-sm text-slate-600 mb-1">PO</label>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={selectedPO}
              onChange={e => {
                setSelectedPO(e.target.value);
                setReceiptItems({});
              }}
            >
              <option value="" disabled>Select a PO</option>
              {options.map((p) => (
                <option key={p.purchaseId} value={p.purchaseId}>{p.poNumber} — {p.supplierName}</option>
              ))}
            </select>
          </div>
        
         
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">SKU</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-right">Ordered</th>
                <th className="px-3 py-2 text-right">Received</th>
                <th className="px-3 py-2 text-right">This Receipt</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-slate-500">Select a PO to view items.</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.productId} className="border-t">
                    <td className="px-3 py-2">{item.sku}</td>
                    <td className="px-3 py-2">{item.productName}</td>
                    <td className="px-3 py-2 text-right">{item.quantityOrdered}</td>
                    <td className="px-3 py-2 text-right">{item.quantityReceived}</td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        className="w-24 rounded border border-slate-300 px-2 py-1 text-right"
                        min={0}
                        max={item.quantityOrdered - item.quantityReceived}
                        value={receiptItems[item.productId] ?? ""}
                        onChange={e => handleReceiptChange(item.productId, e.target.value)}
                        placeholder="Qty"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded border border-slate-300 text-sm">
            Cancel
          </button>
          <button
            type="button"
            className="px-3 py-2 rounded bg-brand text-white text-sm"
            disabled={!selectedPO || items.length === 0 || posting}
            onClick={handlePostReceipt}
          >
            {posting ? "Posting..." : "Post Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
}
