const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");

// 📌 **Create a new candidate**
exports.createCandidate = async (req, res) => {
    try {
        const { name, bio, agenda, election } = req.body;

        if (!mongoose.Types.ObjectId.isValid(election)) {
            return res.status(400).json({ message: "Invalid election ID format." });
        }

        const candidate = new Candidate({
            name,
            bio,
            agenda,
            election: new mongoose.Types.ObjectId(election),
            votes: 0,
        });

        await candidate.save();
        res.status(201).json({ message: "Candidate added successfully", candidate });
    } catch (error) {
        console.error("Error creating candidate:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 **Get all candidates for a specific election**


exports.getCandidatesByElection = async (req, res) => {
    try {
        const { electionId } = req.params;

        // ✅ Convert electionId to ObjectId before querying
        if (!mongoose.Types.ObjectId.isValid(electionId)) {
            return res.status(400).json({ message: "Invalid election ID format" });
        }

        const candidates = await Candidate.find({ electionId: new mongoose.Types.ObjectId(electionId) });

        if (!candidates.length) {
            return res.status(404).json({ message: "No candidates found for this election." });
        }

        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

