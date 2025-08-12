export default function SearchBar({ value, onChange, placeholder, className = "" }) {
	return (
		<div className={["relative", className].join(" ")}> 
			<input
				type="text"
				className="w-full rounded-xl border border-slate-300 bg-white px-11 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
			<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 11.15 11.15z" />
				</svg>
			</span>
		</div>
	);
}
