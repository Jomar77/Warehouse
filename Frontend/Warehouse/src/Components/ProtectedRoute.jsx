import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    
    // Show loading state while authentication is being determined
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-slate-600">Loading...</div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}