import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

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
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:8001/api/users/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "OTP verification failed");

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && <p className="text-red-500">{error}</p>}

                {!otpSent ? (
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <input
                            type="text"
                            name="voterId"
                            placeholder="Voter ID"
                            value={formData.voterId}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 border rounded"
                        >
                            <option value="voter">Voter</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                            Register
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 mb-3 border rounded"
                            required
                        />
                        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Verify OTP
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Register;
