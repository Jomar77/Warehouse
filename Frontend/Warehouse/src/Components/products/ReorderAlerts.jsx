import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";

export default function ReorderAlerts() {
  const { authenticatedFetch } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReorderAlerts = async () => {
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Products/reorder-alerts`
      );
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (error) {
      console.error("Error fetching reorder alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReorderAlerts();
  }, []);

  if (loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-yellow-800">Loading reorder alerts...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              All products are above reorder levels
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg">
      <div className="px-4 py-3 border-b border-red-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Low Stock Alert ({alerts.length} item{alerts.length !== 1 ? 's' : ''})
            </h3>
            <p className="mt-1 text-sm text-red-700">
              The following products are at or below their reorder levels
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-red-500 uppercase">
              <tr>
                <th className="px-2 py-1 text-left">SKU</th>
                <th className="px-2 py-1 text-left">Product</th>
                <th className="px-2 py-1 text-right">On Hand</th>
                <th className="px-2 py-1 text-right">Reorder Level</th>
                <th className="px-2 py-1 text-right">Shortage</th>
              </tr>
            </thead>
            <tbody className="text-red-800">
              {alerts.map((alert) => (
                <tr key={alert.productId} className="border-t border-red-200">
                  <td className="px-2 py-1 font-medium">{alert.sku}</td>
                  <td className="px-2 py-1">{alert.name}</td>
                  <td className="px-2 py-1 text-right font-bold">{alert.quantityOnHand}</td>
                  <td className="px-2 py-1 text-right">{alert.reorderLevel}</td>
                  <td className="px-2 py-1 text-right font-bold text-red-600">
                    {alert.shortageAmount > 0 ? alert.shortageAmount : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
