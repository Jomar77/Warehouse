export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <div className="text-7xl font-black text-slate-300">404</div>
      <h2 className="mt-2 text-xl font-semibold text-slate-800">Page not found</h2>
      <p className="mt-2 text-slate-500">The page you are looking for doesn’t exist.</p>
      <a href="/" className="mt-4 inline-block px-4 py-2 rounded bg-brand text-white text-sm">Go home</a>
    </div>
  );
}
