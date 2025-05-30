const Vote = require("../models/Vote");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const User = require("../models/User");
const mongoose = require("mongoose");

// 📌 **Vote for a Candidate**


// 📌 **Vote for a Candidate**
const voteForCandidate = async (req, res) => {
    try {
        const { electionId, candidateId } = req.body;
        const userId = req.user.userId;  // ✅ Get authenticated user ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(400).json({ message: "Election not found" });
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate || candidate.electionId.toString() !== electionId.toString()) {
            return res.status(400).json({ message: "Candidate not found in this election" });
        }

        const existingVote = await Vote.findOne({ electionId, userId });
        if (existingVote) {
            return res.status(400).json({ message: "You have already voted in this election" });
        }

        const newVote = new Vote({ electionId, candidateId, userId });
        await newVote.save();

        res.status(200).json({ message: "Vote recorded successfully" }); // ✅ Ensure JSON response
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message }); // ✅ Ensure JSON response
    }
};
const getElectionWinner = async (req, res) => {
    try {
        const { electionId } = req.params;

        const votes = await Vote.aggregate([
            { $match: { electionId: new mongoose.Types.ObjectId(electionId) } },
            { $group: { _id: "$candidateId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        if (!votes.length) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        const winner = await Candidate.findById(votes[0]._id);

        res.status(200).json({
            winner: {
                candidateId: winner._id,
                candidateName: winner.name,
                voteCount: votes[0].count,
            }
        });
    } catch (error) {
        console.error("Error fetching winner:", error);
        res.status(500).json({ message: "Failed to fetch winner", error: error.message });
    }
};



// 📌 **Get Election Results**
const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        // Get all votes for the election
        const votes = await Vote.aggregate([
            { $match: { electionId: new mongoose.Types.ObjectId(electionId) } }, // Fix: use 'new' to instantiate ObjectId
            { $group: { _id: "$candidateId", voteCount: { $sum: 1 } } },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate"
                }
            },
            { $unwind: "$candidate" },
            { $project: { candidateName: "$candidate.name", voteCount: 1 } }
        ]);

        if (!votes.length) {
            return res.status(404).json({ message: "No votes found for this election" });
        }

        res.status(200).json({ results: votes });
    } catch (error) {
        console.error("Error:", error); // Log the error for better debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllElectionResults = async (req, res) => {
    try {
        // Fetch only elections that are either Ongoing or Ended
        const elections = await Election.find({
            status: { $in: ["Ongoing", "Ended"] }
        });

        let results = [];

        for (const election of elections) {
            // Count votes for candidates in this election
            const votes = await Vote.aggregate([
                { $match: { electionId: election._id } },
                { $group: { _id: "$candidateId", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            // Skip if no votes yet
            if (votes.length === 0) {
                results.push({
                    electionId: election._id,
                    electionName: election.name,
                    status: election.status,
                    winner: null,
                    message: "No votes yet"
                });
                continue;
            }

            // Get winner details
            const winner = await Candidate.findById(votes[0]._id);

            results.push({
                electionId: election._id,
                electionName: election.name,
                status: election.status,
                winner: {
                    name: winner.name,
                    candidateId: winner._id,
                    votes: votes[0].count
                }
            });
        }

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error fetching election results:", error);
        res.status(500).json({ message: "Failed to fetch results", error: error.message });
    }
};


// Example controller
const checkVoteStatus = async (req, res) => {
    const userId = req.user.userId; // from JWT middleware
    const { electionId } = req.params;

    const vote = await Vote.findOne({ user: userId, election: electionId });
    res.json({ alreadyVoted: !!vote });
};




module.exports = { voteForCandidate, getElectionResults, getAllElectionResults, checkVoteStatus, getElectionWinner };
