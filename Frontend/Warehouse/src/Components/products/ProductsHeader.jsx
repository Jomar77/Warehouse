export default function ProductsHeader({ productsCount, onAddProduct }) {
    return (
        <header className="flex items-end justify-between">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">Products</h2>
                <p className="text-sm text-slate-500">{productsCount} products found</p>
            </div>
            <button 
                onClick={onAddProduct}
                className="px-3 py-2 rounded bg-brand text-white text-sm hover:bg-brand/90 transition-colors"
            >
                Add Product
            </button>
        </header>
    );
}
