import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");

    const LoginHandler = (e) => {
        e.preventDefault();
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        const loginData = {
            username: username,
            password: password,
        };

        const BASEURL = import.meta.env.VITE_API_URL;
        fetch(`${BASEURL}/api/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((res) => res.json())
            .then((body) => {
                if (body !== null && body.token) {
                    sessionStorage.setItem("token", body.token);
                    sessionStorage.setItem("role", body.role);
                    navigate("/Orders");
                } else {
                    setError(body?.message || "Invalid credentials");
                }
            })
            .catch(() => {
                setError("Network error. Please try again.");
            });
    };

    return (
        <div className="min-h-dvh grid lg:grid-cols-2">
            {/* Brand panel */}
            <div className="hidden lg:flex bg-slate-900 text-white p-12 flex-col justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded bg-brand" />
                    <span className="text-lg font-semibold">Warehouse</span>
                </div>
                <div>
                    <h1 className="text-3xl font-semibold leading-tight">Manage inventory with ease</h1>
                    <p className="mt-3 text-slate-300">Track products, orders, and purchases in one place.</p>
                </div>
                <p className="text-xs text-slate-400">© {new Date().getFullYear()} Warehouse</p>
            </div>

            {/* Form panel */}
            <div className="flex items-center justify-center p-6 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-8 lg:hidden flex items-center gap-3">
                        <div className="size-9 rounded bg-brand" />
                        <span className="text-lg font-semibold text-slate-900">Warehouse</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Sign in</h2>
                        <p className="mt-1 text-sm text-slate-500">Enter your credentials</p>

                        <form onSubmit={LoginHandler} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Username</label>
                                <input
                                    ref={usernameInput}
                                    type="text"
                                    required
                                    className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    placeholder="username"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm text-slate-600 mb-1">Password</label>
                                    <button type="button" onClick={() => setShow((s) => !s)} className="text-xs text-slate-500 hover:text-slate-700">
                                        {show ? "Hide" : "Show"}
                                    </button>
                                </div>
                                <input
                                    ref={passwordInput}
                                    type={show ? "text" : "password"}
                                    required
                                    className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className="w-full rounded bg-brand text-white py-2 text-sm font-medium">Sign in</button>

                            {error && (
                                <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
                            )}
                        </form>

                        <p className="mt-6 text-sm text-slate-600">
                            No account? <Link to="/Register" className="text-brand hover:underline">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
