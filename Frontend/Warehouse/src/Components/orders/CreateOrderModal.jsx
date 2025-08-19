import { useState } from "react";
import { useDataContext } from "../../Context/DataContext";

export default function CreateOrderModal({ open, onClose, onSubmit }) {
  const { products, loading: productsLoading } = useDataContext();
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ productId: 1, quantity: 1 }]);
  const [submitting, setSubmitting] = useState(false);

  const handleItemChange = (idx, field, value) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  const handleAddItem = () => setItems([...items, { productId: products[0]?.productId ?? 0, quantity: 1 }]);
  const handleRemoveItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({ customerName, items });
    setSubmitting(false);
    onClose();
  };

  return (
    <dialog open={open} className="modal">
      <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg mb-2">Create Order</h3>
        <div className="mb-4">
          <label className="block text-sm mb-1">Customer Name</label>
          <input
            type="text"
            required
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter customer name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Items</label>
          {productsLoading ? (
            <div className="text-sm text-slate-500">Loading products...</div>
          ) : items.map((item, idx) => {
              const product = products.find(p => p.productId === item.productId);
              return (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <select
                    required
                    value={item.productId}
                    onChange={e => handleItemChange(idx, "productId", e.target.value)}
                    className="select select-bordered w-40"
                  >
                    {products.map(p => (
                      <option key={p.productId} value={p.productId}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    required
                    value={item.quantity}
                    onChange={e => handleItemChange(idx, "quantity", e.target.value)}
                    className="input input-bordered w-20"
                    placeholder="Quantity"
                  />
                  <span className="text-xs text-slate-500 w-32 truncate">
                    {product ? product.name : "Unknown Product"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-xs btn-error"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length === 1}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAddItem} disabled={productsLoading || products.length === 0}>
            + Add Item
          </button>
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || productsLoading}>
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}