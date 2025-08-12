import SectionHeader from "./SectionHeader";

export default function CreatePurchase({ onCancel }) {
  return (
    <div className="space-y-4">
      <SectionHeader title="Create Purchase" subtitle="Draft a new purchase order" onCancel={onCancel} />
      <form
        className="rounded-lg border border-slate-200 bg-white p-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Saved (mock).");
          onCancel();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Supplier</label>
            <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Supplier name" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Order Date</label>
            <input type="date" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Reference</label>
            <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Optional" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Items</span>
            <button type="button" className="text-sm text-brand hover:underline">
              + Add item
            </button>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Unit Price</th>
                  <th className="px-3 py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" placeholder="SKU-001" /></td>
                  <td className="px-3 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" placeholder="Widget A" /></td>
                  <td className="px-3 py-2 text-right"><input type="number" className="w-24 rounded border border-slate-300 px-2 py-1 text-right" defaultValue={1} /></td>
                  <td className="px-3 py-2 text-right"><input type="number" step="0.01" className="w-28 rounded border border-slate-300 px-2 py-1 text-right" defaultValue={100} /></td>
                  <td className="px-3 py-2 text-right text-slate-600">$100.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-2 rounded border border-slate-300 text-sm">
            Cancel
          </button>
          <button type="submit" className="px-3 py-2 rounded bg-brand text-white text-sm">
            Save Draft
          </button>
          <button type="submit" className="px-3 py-2 rounded bg-slate-900 text-white text-sm">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
