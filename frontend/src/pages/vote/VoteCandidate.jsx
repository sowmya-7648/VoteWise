import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VoteCandidates = () => {
    const { electionId } = useParams(); // Get electionId from URL
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState(""); // ✅ For success or error messages

    useEffect(() => {
        if (!electionId) {
            setError("Election ID not found.");
            setLoading(false);
            return;
        }

        const fetchCandidates = async () => {
            try {
                const response = await fetch(`http://localhost:8001/api/candidates/election/${electionId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch candidates");
                }

                setCandidates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [electionId]);

    // 📌 **Handle Vote Button Click**
    const handleVote = async (candidateId) => {
        setMessage(""); // Clear previous messages

        const token = localStorage.getItem("token"); // ✅ Get token from localStorage
        if (!token) {
            setMessage("You must be logged in to vote.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8001/api/votes/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ Send authentication token
                },
                body: JSON.stringify({ electionId, candidateId }),
            });

            const text = await response.text(); // 🔍 Read response as text first
            console.log("Vote API Response:", text); // Debugging step

            const data = JSON.parse(text); // Try to parse as JSON

            if (!response.ok) {
                throw new Error(data.message || "Voting failed");
            }

            setMessage("Vote recorded successfully!");
        } catch (error) {
            console.error("Vote Error:", error); // Log full error details
            setMessage(error.message);
        }
    };


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Candidates</h1>

            {loading && <p>Loading candidates...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}

            {!loading && !error && candidates.length === 0 && (
                <p>No candidates found for this election.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <div key={candidate._id} className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold">{candidate.name}</h2>
                        <p className="text-gray-600">{candidate.description}</p>
                        <button
                            className="mt-3 bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
                            onClick={() => handleVote(candidate._id)}
                        >
                            Vote
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoteCandidates;
