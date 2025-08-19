import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function CreatePurchase({ open, onClose, onCreated, creating, setCreating }) {
  // Form state
  const [supplierId, setSupplierId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [items, setItems] = useState([{ productId: "", quantityOrdered: 1 }]);
  const [submitting, setSubmitting] = useState(false);

  // Real supplier/product data
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const { authenticatedFetch } = useAuth();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Suppliers`);
        const data = await res.json();
        setSuppliers(data || []);
        // Flatten all products from all suppliers
        const allProducts = (data || []).flatMap(s => s.products || []);
        setProducts(allProducts);
      } catch (err) {
        setSuppliers([]);
        setProducts([]);
      }
    };
    fetchSuppliers();
  }, [authenticatedFetch]);

  const handleItemChange = (idx, field, value) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => setItems([...items, { productId: products[0]?.productId ?? "", quantityOrdered: 1 }]);
  const handleRemoveItem = idx => setItems(items.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setCreating(true);
    try {
      // Build payload
      const payload = {
        supplierId: Number(supplierId),
        expectedDelivery,
        items: items.map(i => ({ productId: Number(i.productId), quantityOrdered: Number(i.quantityOrdered) }))
      };
      // API call
      const res = await authenticatedFetch(`${import.meta.env.VITE_API_URL}/api/Purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create purchase");
      onCreated && onCreated();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
      setCreating(false);
      onClose();
    }
  };

  return (
    <dialog open={open} className="modal">
      <form method="dialog" className="modal-box" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg mb-2">Create Purchase</h3>
        <div className="mb-4">
          <label className="block text-sm mb-1">Supplier</label>
          <select
            required
            value={supplierId}
            onChange={e => setSupplierId(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="" disabled>Select supplier</option>
            {suppliers.map(s => (
              <option key={s.supplierId} value={s.supplierId}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Expected Delivery</label>
          <input
            type="date"
            required
            value={expectedDelivery}
            onChange={e => setExpectedDelivery(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Items</label>
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <select
                required
                value={item.productId}
                onChange={e => handleItemChange(idx, "productId", e.target.value)}
                className="select select-bordered w-40"
              >
                <option value="" disabled>Select product</option>
                {products.map(p => (
                  <option key={p.productId} value={p.productId}>{p.name} ({p.sku})</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                required
                value={item.quantityOrdered}
                onChange={e => handleItemChange(idx, "quantityOrdered", e.target.value)}
                className="input input-bordered w-20"
                placeholder="Quantity"
              />
              <button
                type="button"
                className="btn btn-xs btn-error"
                onClick={() => handleRemoveItem(idx)}
                disabled={items.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline" onClick={handleAddItem}>
            + Add Item
          </button>
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose} disabled={submitting || creating}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting || creating}>
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
