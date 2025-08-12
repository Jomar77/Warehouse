import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * Decodes JWT payload without verification (client-side only)
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
function decodeJwtPayload(token) {
  try {
    const [, payload] = token.split(".");
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.warn("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Checks if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired or invalid
 */
function isTokenExpired(token) {
  if (!token) return true;
  
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false; // No expiration claim
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime;
}

/**
 * AuthProvider component that manages authentication state
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [role, setRole] = useState(() => sessionStorage.getItem("role") || "");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user data from token
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const payload = decodeJwtPayload(token);
      setUser(payload);
    } else if (token && isTokenExpired(token)) {
      // Clear expired token
      logout();
    }
    setIsLoading(false);
  }, [token]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.storageArea !== sessionStorage) return;
      
      if (event.key === "token") {
        setToken(event.newValue || "");
      }
      if (event.key === "role") {
        setRole(event.newValue || "");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /**
   * Authenticates user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, message?: string, role?: string}>}
   */
  const login = useCallback(async (username, password) => {
    try {
      const loginData = { username, password };
      const baseUrl = import.meta.env.VITE_API_URL; // Changed from VITE_API_BASE_URL to VITE_API_URL
      
      const response = await fetch(`${baseUrl}/api/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data?.token) {
        // Store auth data
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role || "");
        
        // Update state
        setToken(data.token);
        setRole(data.role || "");
        
        const payload = decodeJwtPayload(data.token);
        setUser(payload);

        return {
          success: true,
          message: data.message || "Login successful",
          role: data.role,
        };
      } else {
        return {
          success: false,
          message: data?.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }, []);

  /**
   * Logs out the current user and clears auth state
   */
  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    setToken("");
    setRole("");
    setUser(null);
  }, []);

  /**
   * Makes authenticated HTTP requests with JWT token
   * @param {string|Request} input - URL or Request object
   * @param {RequestInit} init - Fetch options
   * @returns {Promise<Response>}
   */
  const authenticatedFetch = useCallback(async (input, init = {}) => {
    const headers = new Headers(init.headers);
    
    if (token && !isTokenExpired(token)) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(input, {
      ...init,
      headers,
    });
  }, [token]);

  /**
   * Checks if user has specific role
   * @param {string} requiredRole - Role to check
   * @returns {boolean}
   */
  const hasRole = useCallback((requiredRole) => {
    return role === requiredRole;
  }, [role]);

  const contextValue = {
    // Auth state
    token,
    role,
    user,
    isAuthenticated: !!token && !isTokenExpired(token),
    isLoading,
    
    // Auth methods
    login,
    logout,
    authenticatedFetch,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context
 * @returns {object} Auth context value
 * @throws {Error} When used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}

/**
 * Hook to get authenticated user data
 * @returns {object|null} User data from JWT payload
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user has specific role
 * @param {string} requiredRole - Role to check
 * @returns {boolean}
 */
export function useRole(requiredRole) {
  const { hasRole } = useAuth();
  return hasRole(requiredRole);
}