import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export function DataProvider({ children }) {
  const { authenticatedFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/api/Products`,
        { headers: { Accept: "application/json" } }
      );
      setProducts(res.ok ? await res.json() : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <DataContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}