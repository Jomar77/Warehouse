export default function SortableTh({ children, onClick, active, dir, align = "left" }) {
  return (
    <th className={`px-4 py-2 text-${align}`}>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:underline">
        <span>{children}</span>
        {active && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-slate-500">
            {dir === "asc" ? (
              <path fillRule="evenodd" d="M10 3a1 1 0 0 1 .832.445l4 6a1 1 0 0 1-1.664 1.11L10 5.882 6.832 10.555a1 1 0 1 1-1.664-1.11l4-6A1 1 0 0 1 10 3Z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 17a1 1 0 0 1-.832-.445l-4-6a1 1 0 1 1 1.664-1.11L10 14.118l3.168-4.673a1 1 0 1 1 1.664 1.11l-4 6A1 1 0 0 1 10 17Z" clipRule="evenodd" />
            )}
          </svg>
        )}
      </button>
    </th>
  );
}
