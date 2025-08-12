export default function SectionHeader({ title, subtitle, onCancel }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
        >
          Back to List
        </button>
      </div>
    </header>
  );
}
