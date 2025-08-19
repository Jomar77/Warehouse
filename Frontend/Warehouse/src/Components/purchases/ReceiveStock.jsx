import SectionHeader from "./SectionHeader";

export default function ReceiveStock({ onCancel, options = [] }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Receive Stock" subtitle="Record items received against a PO" onCancel={onCancel} />
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">PO</label>
            <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" defaultValue="">
              <option value="" disabled>Select a PO</option>
              {options.map((p) => (
                <option key={p.purchaseId} value={p.purchaseId}>{p.poNumber} — {p.supplierName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Received Date</label>
            <input type="date" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Reference</label>
            <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="GRN / Packing slip" />
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
              <tr className="border-t">
                <td className="px-3 py-2">SKU-001</td>
                <td className="px-3 py-2">Widget A</td>
                <td className="px-3 py-2 text-right">10</td>
                <td className="px-3 py-2 text-right">4</td>
                <td className="px-3 py-2 text-right">
                  <input type="number" className="w-24 rounded border border-slate-300 px-2 py-1 text-right" defaultValue={6} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded border border-slate-300 text-sm">
            Cancel
          </button>
          <button type="button" className="px-3 py-2 rounded bg-brand text-white text-sm">
            Post Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
