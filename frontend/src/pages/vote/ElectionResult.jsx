import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ElectionResult = () => {
    const { electionId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:8001/api/votes/results/${electionId}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch results");
                }

                setCandidates(data.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [electionId]);

    return (
        <div className="container mx-auto p-6 bg-indigo-100">
            <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">🏆 Election Results</h1>

            {loading && <p className="text-center text-gray-500 animate-pulse">Fetching results...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && candidates.length === 0 && (
                <p className="text-center text-gray-500">No results available yet.</p>
            )}

            {candidates.length > 0 && (
                <div className="mt-6 p-5 border border-indigo-300 rounded-lg shadow-lg bg-white">
                    <h2 className="text-2xl font-bold text-indigo-700">📋 Candidates & Votes</h2>
                    <ul className="mt-4 space-y-3">
                        {candidates.map((candidate) => (
                            <li
                                key={candidate._id}
                                className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
                            >
                                <p className="text-lg font-semibold text-gray-800">
                                    {candidate.candidateName}
                                </p>
                                <p className="text-gray-600">
                                    🗳️ <span className="font-semibold">{candidate.voteCount}</span> votes
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ElectionResult;
