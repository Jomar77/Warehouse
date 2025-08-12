import { useState } from "react";

export default function Register() {
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [submitted, setSubmitted] = useState(false);

	function onChange(e) {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	}

	function onSubmit(e) {
		e.preventDefault();
		setSubmitted(true);
	}

	return (
		<section className="max-w-xl">
			<h2 className="text-xl font-semibold text-slate-800 mb-4">Register</h2>
			<form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-slate-200">
				<div>
					<label className="block text-sm text-slate-600 mb-1">Full name</label>
					<input
						name="name"
						value={form.name}
						onChange={onChange}
						className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
						placeholder="Jane Doe"
					/>
				</div>
				<div>
					<label className="block text-sm text-slate-600 mb-1">Email</label>
					<input
						type="email"
						name="email"
						value={form.email}
						onChange={onChange}
						className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
						placeholder="jane@example.com"
					/>
				</div>
				<div>
					<label className="block text-sm text-slate-600 mb-1">Password</label>
					<input
						type="password"
						name="password"
						value={form.password}
						onChange={onChange}
						className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
						placeholder="••••••••"
					/>
				</div>
				<button className="px-4 py-2 rounded bg-brand text-white text-sm">Create account</button>
				{submitted && (
					<p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
						Submitted (mock). No backend calls.
					</p>
				)}
			</form>
		</section>
	);
}
