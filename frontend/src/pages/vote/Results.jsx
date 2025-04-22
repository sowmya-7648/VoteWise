import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Results = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await fetch("http://localhost:8001/api/elections/ongoing");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch elections");
                }

                // Fetch winner for each election
                const electionsWithWinners = await Promise.all(
                    data.map(async (election) => {
                        try {
                            const res = await fetch(`http://localhost:8001/api/votes/winner/${election._id}`);
                            const result = await res.json();
                            return {
                                ...election,
                                winner: res.ok ? result.winner : null,
                            };
                        } catch {
                            return { ...election, winner: null };
                        }
                    })
                );

                setElections(electionsWithWinners);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchElections();
    }, []);

    return (
        <div className="container mx-auto p-6 bg-indigo-100">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                🗳️ Ongoing Elections & Winners
            </h1>

            {loading && <p className="text-center text-gray-500 animate-pulse">Loading elections...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && elections.length === 0 && (
                <p className="text-gray-500 text-center">No ongoing elections available.</p>
            )}

            {!loading && !error && elections.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {elections.map((election) => (
                        <div
                            key={election._id}
                            className="p-5 border border-indigo-300 rounded-lg shadow-lg bg-white cursor-pointer hover:bg-indigo-50 transition"
                            onClick={() => navigate(`/election-result/${election._id}`)}
                        >
                            <h3 className="text-xl font-bold text-indigo-700">{election.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {new Date(election.startDate).toLocaleDateString()} -{" "}
                                {new Date(election.endDate).toLocaleDateString()}
                            </p>

                            {election.winner ? (
                                <div className="text-green-600 font-semibold">
                                    👑 Winner: {election.winner.candidateName}
                                </div>
                            ) : (
                                <div className="text-gray-400">Winner not available</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results;
