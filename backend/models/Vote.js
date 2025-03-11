const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    votedAt: {
        type: Date,
        default: Date.now
    }
});

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
