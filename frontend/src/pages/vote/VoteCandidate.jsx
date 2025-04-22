import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VoteCandidates = () => {
    const { electionId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [voted, setVoted] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!electionId) {
            setError("❌ Election ID not found.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Candidates
                const response = await fetch(`http://localhost:8001/api/candidates/election/${electionId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch candidates");
                setCandidates(data);

                // 2. Check if Already Voted
                if (token) {
                    const voteRes = await fetch(`http://localhost:8001/api/votes/check-vote/${electionId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const voteData = await voteRes.json();
                    if (voteRes.ok && voteData.alreadyVoted) {
                        setVoted(true);
                        setMessage("⚠️ You have already voted for this election.");
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [electionId, token]);

    const handleVote = async (candidateId) => {
        if (voted) {
            setMessage("⚠️ You have already voted for this election.");
            return;
        }

        if (!token) {
            setMessage("❌ You must be logged in to vote.");
            return;
        }

        setMessage("");

        try {
            const response = await fetch("http://localhost:8001/api/votes/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ electionId, candidateId }),
            });

            const text = await response.text();
            console.log("Vote API Response:", text);

            const data = JSON.parse(text);

            if (!response.ok) {
                throw new Error(data.message || "Voting failed");
            }

            setMessage("✅ Vote recorded successfully!");
            setVoted(true);
        } catch (error) {
            console.error("Vote Error:", error);
            setMessage(`❌ ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-indigo-100">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">🏆 Candidates</h1>

            {loading && <p className="text-center text-gray-500 animate-pulse">Loading candidates...</p>}
            {error && <p className="text-center text-indigo-500">{error}</p>}
            {message && <p className="text-center text-green-500">{message}</p>}

            {!loading && !error && candidates.length === 0 && (
                <p className="text-center text-gray-500">No candidates found for this election. 🕒</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <div key={candidate._id} className="p-5 border border-indigo-300 rounded-lg shadow-lg bg-white">
                        <h2 className="text-xl font-bold text-indigo-700">{candidate.name}</h2>
                        <p className="text-gray-600">{candidate.description}</p>
                        <button
                            className={`mt-3 px-4 py-2 rounded-md transition ${voted
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-500 hover:bg-indigo-600 text-white"
                                }`}
                            onClick={() => handleVote(candidate._id)}
                            disabled={voted}
                        >
                            {voted ? "Voted ✅" : "Vote"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoteCandidates;
