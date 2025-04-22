import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Import context

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { setIsAuthenticated } = useAuth(); // ✅ Use context

    useEffect(() => {
        const email = localStorage.getItem("email");
        if (!email) {
            alert("Email not found. Please log in again.");
            navigate("/login");
        }
    }, [navigate]);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const email = localStorage.getItem("email");
        if (!email) {
            setError("Email not found. Please log in again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8001/api/users/verify-login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "OTP verification failed");

            if (!data.token) throw new Error("No token received from backend!");

            localStorage.setItem("token", data.token);
            setIsAuthenticated(true); // ✅ Mark user as authenticated
            alert("✅ OTP Verified Successfully!");
            navigate("/"); // or navigate("/election") if you prefer
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-indigo-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Verify OTP</h2>
                {error && <p className="text-indigo-500 text-center mb-2">{error}</p>}

                <form onSubmit={handleVerifyOTP}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                    <button
                        className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyOTP;
