import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        voterId: "",
        role: "voter",
    });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.age || !formData.voterId) {
            setError("❌ All fields are required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError("❌ Invalid email format.");
            return false;
        }
        if (formData.password.length < 6) {
            setError("❌ Password must be at least 6 characters.");
            return false;
        }
        if (isNaN(formData.age) || formData.age < 18) {
            setError("❌ You must be at least 18 years old.");
            return false;
        }
        if (!/^[a-zA-Z0-9]+$/.test(formData.voterId)) {
            setError("❌ Voter ID must be alphanumeric.");
            return false;
        }
        setError("");
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8001/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registration failed");

            setOtpSent(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setOtpLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8001/api/users/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "OTP verification failed");

            alert("✅ Registration successful!");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-indigo-100 p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">Register</h2>
                {error && <p className="text-indigo-500 text-center mb-4">{error}</p>}

                {!otpSent ? (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Age</label>
                            <input
                                type="number"
                                name="age"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Voter ID</label>
                            <input
                                type="text"
                                name="voterId"
                                placeholder="Enter your Voter ID"
                                value={formData.voterId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="voter">Voter</option>
                                {/* <option value="admin">Admin</option> */}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">OTP</label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white rounded-md transition ${otpLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            disabled={otpLoading}
                        >
                            {otpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
