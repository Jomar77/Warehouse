export function LoadingState() {
    return (
        <section className="space-y-4">
            <div className="text-center py-8">
                <p className="text-slate-500">Loading products...</p>
            </div>
        </section>
    );
}

export function ErrorState({ error }) {
    return (
        <section className="space-y-4">
            <div className="text-center py-8">
                <p className="text-red-500">Error loading products: {error}</p>
            </div>
        </section>
    );
}
