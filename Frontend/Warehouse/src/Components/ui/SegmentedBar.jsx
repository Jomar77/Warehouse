export function SegmentedBar({ children }) {
  return (
    <div className="w-full max-w-4xl grid grid-cols-3 overflow-hidden rounded-md border border-slate-300 bg-slate-200">
      {children}
    </div>
  );
}

export function ToolbarButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-4 py-3 text-sm font-medium transition-colors",
        active ? "bg-white text-slate-900" : "bg-slate-200 text-slate-700 hover:bg-slate-300",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
