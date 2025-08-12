import SectionHeader from "./SectionHeader";

export default function ApprovePurchase({ onCancel, submitted = [] }) {
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
              <th className="px-4 py-2 text-right">Total</th>
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
            {submitted.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{p.id}</td>
                <td className="px-4 py-2">{p.supplier}</td>
                <td className="px-4 py-2 text-right">{p.items}</td>
                <td className="px-4 py-2 text-right">${p.total.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button type="button" className="px-3 py-1.5 rounded bg-brand text-white text-xs">Approve</button>
                    <button type="button" className="px-3 py-1.5 rounded border border-slate-300 text-xs">Reject</button>
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
