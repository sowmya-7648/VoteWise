import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const email = localStorage.getItem("email"); // Ensure same email is used

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("No email found. Try logging in again.");
            return;
        }

        try {
            console.log("Sending OTP verification request:", { email, otp });

            const response = await fetch("http://localhost:8001/api/users/verify-login-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();
            console.log("Response from backend:", data);

            if (!response.ok) {
                throw new Error(data.message || "OTP verification failed");
            }

            alert(data.message);
            localStorage.setItem("token", data.token); // Save token after login
            navigate("/");
        } catch (error) {
            console.error("OTP Verification Error:", error);
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Enter OTP</h2>
            <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
    );
};

export default VerifyOTP;
