const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    bio: { type: String, required: true },  // Short biography of the candidate
    agenda: { type: String, required: true },  // Candidate's key election agenda
    electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
    votes: { type: Number, default: 0 },
    image: { type: String, required: true } // URL or file path of the candidate's image
});

module.exports = mongoose.model("Candidate", candidateSchema);
