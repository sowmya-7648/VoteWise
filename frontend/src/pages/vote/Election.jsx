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

    const getStatusColor = (status) => {
        switch (status) {
            case "ongoing":
                return "bg-green-100 text-green-600";
            case "upcoming":
                return "bg-blue-100 text-blue-600";
            case "completed":
                return "bg-gray-200 text-gray-600";
            default:
                return "";
        }
    };

    const renderElections = (status, label) => {
        const filtered = elections.filter(e => e.status === status);
        if (filtered.length === 0) return null;

        return (
            <div className="mb-10">
                <h3 className="text-2xl font-semibold mb-4 text-indigo-700">{label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((election) => (
                        <div
                            key={election._id}
                            className="bg-white shadow-md p-6 rounded-lg border border-indigo-200 transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            <h3 className="text-xl font-bold text-gray-900">{election.name}</h3>
                            <p className="text-gray-600 mt-1">{election.description}</p>
                            {/* <p className="text-gray-500 text-sm mt-1">
                                {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                            </p> */}

                            <span
                                className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(election.status)}`}
                            >
                                {election.status.toUpperCase()}
                            </span>

                            <Link
                                to={`/election/${election._id}/candidates`}
                                className="block mt-4 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 text-center transition-all"
                            >
                                View Candidates
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-6 bg-indigo-100">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">📋 Elections Overview</h2>

            {loading && <p className="text-center text-gray-500 animate-pulse">Loading elections...</p>}
            {error && <p className="text-indigo-500 text-center">{error}</p>}

            {!loading && elections.length === 0 && (
                <p className="text-gray-500 text-center">No elections available.</p>
            )}

            {!loading && elections.length > 0 && (
                <>
                    {renderElections("ongoing", "🟢 Ongoing Elections")}
                    {renderElections("upcoming", "🔵 Upcoming Elections")}
                    {renderElections("completed", "⚫ Completed Elections")}
                </>
            )}
        </div>
    );
}

export default Election;
