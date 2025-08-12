import { Navigate } from "react-router-dom";

function isTokenValid(token) {
    if (!token) return false;
    
    try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        const now = Math.floor(Date.now() / 1000);
        return decoded.exp ? decoded.exp > now : true;
    } catch {
        return false;
    }
}

export default function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem("token");
    
    if (!isTokenValid(token)) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}