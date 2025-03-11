import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Vote = () => {
    const [ongoingElections, setOngoingElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOngoingElections = async () => {
            try {
                const response = await fetch("http://localhost:8001/api/elections/ongoing");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch ongoing elections");
                }

                setOngoingElections(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOngoingElections();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Ongoing Elections</h1>

            {loading && <p>Loading ongoing elections...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && ongoingElections.length === 0 && (
                <p>No ongoing elections at the moment.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingElections.map((election) => (
                    <div key={election._id} className="p-4 border rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold">{election.name}</h2>
                        <p className="text-gray-600">{election.description}</p>
                        <p className="text-sm text-gray-500">
                            Ends on: {new Date(election.endDate).toLocaleDateString()}
                        </p>
                        <Link
                            to={`/vote/${election._id}`}
                            className="mt-3 inline-block bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 transition"
                        >
                            View Candidates
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vote;
