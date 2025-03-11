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
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-4">Candidates</h2>

            {loading && <p>Loading candidates...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div key={candidate._id} className="bg-white shadow-md p-4 rounded-lg">
                            <img src={candidate.image} alt={candidate.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                            <h3 className="text-xl font-bold">{candidate.name}</h3>
                            <p className="text-gray-600">{candidate.party}</p>
                            <button
                                onClick={() => setSelectedCandidate(candidate)}
                                className="block mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No candidates available.</p>
                )}
            </div>

            {/* Modal Dialog */}
            {selectedCandidate && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-2">{selectedCandidate.name}</h3>
                        <p className="text-gray-600 font-semibold">{selectedCandidate.party}</p>
                        <p className="mt-2 text-gray-700">{selectedCandidate.bio}</p>
                        <p className="mt-2 text-gray-700"><strong>Agenda:</strong> {selectedCandidate.agenda}</p>
                        <button
                            onClick={() => setSelectedCandidate(null)}
                            className="mt-4 bg-red-500 w-full text-white py-2 px-4 rounded hover:bg-red-600"
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
