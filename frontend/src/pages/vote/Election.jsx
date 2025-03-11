import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Election() {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchElections = async () => {
            try {
                const response = await fetch("http://localhost:8001/api/elections");
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Failed to fetch elections");

                setElections(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchElections();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-4">All Elections</h2>

            {loading && <p>Loading elections...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elections.length > 0 ? (
                    elections.map((election) => (
                        <div key={election._id} className="bg-white shadow-md p-4 rounded-lg">
                            <h3 className="text-xl font-bold">{election.name}</h3>
                            <p className="text-gray-600">{election.description}</p>
                            <p className="text-gray-500">
                                {new Date(election.startDate).toLocaleDateString()} -{" "}
                                {new Date(election.endDate).toLocaleDateString()}
                            </p>
                            <p className={`font-bold ${election.status === "ongoing" ? "text-green-500" : "text-gray-500"}`}>
                                {election.status.toUpperCase()}
                            </p>
                            <Link
                                to={`/election/${election._id}/candidates`}
                                className="block mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
                            >
                                View Candidates
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No elections available.</p>
                )}
            </div>
        </div>
    );
}

export default Election;
