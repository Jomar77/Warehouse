import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleInputChange(e) {
        const { name, value } = e.target;
        setForm((previousForm) => ({ ...previousForm, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL; // Changed from VITE_API_BASE_URL to VITE_API_URL
            
            if (!baseUrl) {
                throw new Error("API URL not configured");
            }

            const response = await fetch(`${baseUrl}/api/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    password: form.password,
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setSuccess(responseData?.message || "Registration successful! You can now log in.");
                setForm({ username: "", password: "" });
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(responseData?.message || "Registration failed. Please try again.");
            }
        } catch (networkError) {
            console.error("Registration error:", networkError);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center gap-3">
                    <div className="size-9 rounded bg-brand" />
                    <span className="text-lg font-semibold text-slate-900">Warehouse</span>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">Create Account</h2>
                    <p className="mt-1 text-sm text-slate-500">Join our warehouse management system</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm text-slate-600 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={form.username}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="Enter username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-slate-600 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={form.password}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50 disabled:text-slate-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isSubmitting || !form.username.trim() || !form.password.trim()}
                            className="w-full rounded bg-brand text-white py-2 text-sm font-medium disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>

                        {error && (
                            <div className="rounded border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded border border-green-200 bg-green-50 text-green-700 text-sm px-3 py-2">
                                {success}
                            </div>
                        )}
                    </form>

                    <p className="mt-6 text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="text-brand hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
