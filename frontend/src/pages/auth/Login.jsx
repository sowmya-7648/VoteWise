import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Add loading state
    const [showPassword, setShowPassword] = useState(false); // ✅ Toggle password visibility

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // ✅ Simple client-side validation
        if (!email || !password) {
            setError("❌ Please fill in both fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("❌ Please enter a valid email address.");
            return;
        }

        setError(""); // Clear previous errors
        setLoading(true); // Show loading state

        try {
            const response = await fetch("http://localhost:8001/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            setLoading(false);
            alert("✅ " + data.message); // OTP sent message
            localStorage.setItem("email", email); // ✅ Store email for OTP verification
            navigate("/verify-otp"); // ✅ Redirect to OTP verification
        } catch (error) {
            setLoading(false);
            setError("❌ " + error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-indigo-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">Login</h2>

            {error && <p className="text-indigo-500 text-center mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full px-4 py-2 text-white rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="text-center mt-4 text-gray-600">
                Don't have an account? <a href="/register" className="text-indigo-500">Register</a>
            </p>
        </div>
    );
};

export default Login;
