export default function SectionHeader({ title, subtitle, onCancel }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 rounded border border-slate-300 text-sm"
        >
          Back
        </button>
      )}
    </header>
  );
}
