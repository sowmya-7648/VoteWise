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
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading)
        return <p className="text-center text-gray-500 animate-pulse">Loading profile...</p>;
    if (error)
        return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-2xl shadow-xl border border-indigo-200">
            <h2 className="text-3xl font-extrabold text-center text-indigo-600 mb-6">
                My Profile
            </h2>

            {user ? (
                <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-md">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 text-gray-800">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>Voter ID:</strong> {user.voterId}</p>

                        <div>
                            <strong>Role:</strong>
                            <span className="ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-600">
                                {user.role}
                            </span>
                        </div>

                        <div>
                            <strong>Verified:</strong>
                            <span className={`ml-2 inline-block px-3 py-1 text-sm font-semibold rounded-full
                                ${user.isVerified
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"}`}>
                                {user.isVerified ? "✅ Verified" : "❌ Not Verified"}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">No user data available</p>
            )}
        </div>
    );
}

export default Profile;
