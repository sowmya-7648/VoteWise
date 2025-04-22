import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Candidates() {
    const { id } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch(`http://localhost:8001/api/candidates/election/${id}`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Failed to fetch candidates");

                setCandidates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [id]);

    return (
        <div className="container mx-auto p-6 bg-indigo-100">
            <h2 className="text-3xl font-bold mb-4 text-indigo-600">Candidates</h2>

            {loading && <p className="text-center text-gray-500 animate-pulse">Loading candidates...</p>}
            {error && <p className="text-indigo-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div key={candidate._id} className="bg-white shadow-md p-4 rounded-lg border border-gray-200">
                            <img
                                src={`/images/candidates/${candidate.image}`}
                                alt={candidate.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                            <p className="text-gray-600">{candidate.party}</p>
                            <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className="block mt-3 w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 text-center"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    !loading && <p className="text-gray-500 text-center">No candidates available.</p>
                )}
            </div>

            {/* Modal Dialog */}
            {selectedCandidate && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-all duration-300">
                    <div className="relative block overflow-hidden rounded-lg border border-indigo-300 bg-white p-6 sm:p-8 lg:p-10 max-w-md shadow-lg scale-95 animate-fadeIn">
                        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500"></span>

                        <div className="sm:flex sm:justify-between sm:gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-indigo-600 sm:text-xl">
                                    {selectedCandidate.name}
                                </h3>
                                <p className="mt-1 text-xs font-medium text-indigo-500">{selectedCandidate.party}</p>
                            </div>

                            <div className="hidden sm:block sm:shrink-0">
                                <img
                                    alt={selectedCandidate.name}
                                    src={`/images/candidates/${selectedCandidate.image}`}
                                    className="size-16 rounded-lg object-cover shadow-md border border-indigo-300"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-700">{selectedCandidate.bio}</p>
                            <p className="mt-2 text-sm text-gray-700">
                                <strong className="text-indigo-600">Agenda:</strong> {selectedCandidate.agenda}
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedCandidate(null)}
                            className="mt-4 block w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 text-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Candidates;
