import React, { useEffect, useState } from "react";

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch("http://localhost:8001/api/votes/results");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch results");
                }

                setResults(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Election Winners</h1>

            {loading && <p>Loading results...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && results.length === 0 && (
                <p>No results available yet.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((election) => (
                    <div key={election.electionId} className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold">{election.electionName}</h2>
                        <p className="text-gray-600">
                            🏆 Winner: <strong>{election.winner.name}</strong>
                        </p>
                        <p className="text-gray-600">Votes: {election.winner.votes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
