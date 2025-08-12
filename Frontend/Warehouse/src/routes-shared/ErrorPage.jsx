export default function ErrorPage() {
  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="text-7xl font-black text-slate-300">Oops</div>
      <h2 className="mt-2 text-xl font-semibold text-slate-800">Something went wrong</h2>
      <p className="mt-2 text-slate-500">An unexpected error occurred while rendering this page.</p>
      <a href="/" className="mt-4 inline-block px-4 py-2 rounded bg-brand text-white text-sm">Go home</a>
    </div>
  );
}
