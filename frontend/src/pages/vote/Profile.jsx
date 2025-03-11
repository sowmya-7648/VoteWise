import React, { useEffect, useState } from "react";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated");

                const response = await fetch("http://localhost:8001/api/users/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ Send token
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setUser(data); // ✅ Set user state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>
            {user ? (
                <>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Age:</strong> {user.age}</p>
                    <p><strong>Voter ID:</strong> {user.voterId}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Verified:</strong> {user.isVerified ? "✅ Yes" : "❌ No"}</p>
                </>
            ) : (
                <p className="text-center text-gray-500">No user data available</p>
            )}
        </div>
    );
}

export default Profile;
