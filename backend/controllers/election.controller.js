const Election = require("../models/Election");

// ✅ Function to get correct status
const getElectionStatus = (startDate, endDate) => {
    const now = new Date();
    if (now < startDate) return "upcoming";
    if (now >= startDate && now <= endDate) return "ongoing";
    return "completed";
};

// ✅ Create Election
exports.createElection = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        const status = getElectionStatus(parsedStartDate, parsedEndDate);

        const election = new Election({
            name,
            description,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            status
        });

        await election.save();
        res.status(201).json({ message: "Election created successfully!", election });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Keep this to refresh statuses before fetching
const updateElectionStatus = async () => {
    const now = new Date();

    await Election.updateMany({ startDate: { $gt: now } }, { $set: { status: "upcoming" } });
    await Election.updateMany({ startDate: { $lte: now }, endDate: { $gte: now } }, { $set: { status: "ongoing" } });
    await Election.updateMany({ endDate: { $lt: now } }, { $set: { status: "completed" } });
};

// ✅ Get All Elections
exports.getElections = async (req, res) => {
    try {
        await updateElectionStatus();
        const elections = await Election.find().sort({ startDate: 1 });
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// controllers/electionController.js
exports.getOngoingElections = async (req, res) => {
    try {
        const currentDate = new Date();
        await Election.updateMany(
            { startDate: { $gt: currentDate } },
            { $set: { status: "upcoming" } }
        );
        await Election.updateMany(
            { startDate: { $lte: currentDate }, endDate: { $gte: currentDate } },
            { $set: { status: "ongoing" } }
        );
        await Election.updateMany(
            { endDate: { $lt: currentDate } },
            { $set: { status: "completed" } }
        );

        const ongoingElections = await Election.find({ status: "ongoing" });
        res.status(200).json(ongoingElections);
    } catch (err) {
        res.status(500).json({ message: "Error fetching ongoing elections", error: err.message });
    }
};


// 📌 Get all elections (ongoing and completed separately)
exports.getElectionsByStatus = async (req, res) => {
    try {
        const currentDate = new Date();

        const completedElections = await Election.find({
            endDate: { $lt: currentDate }
        });

        res.status(200).json({
            completed: completedElections
        });
    } catch (error) {
        console.error("Error fetching elections:", error);
        res.status(500).json({ message: "Failed to fetch elections", error: error.message });
    }
};

exports.getOngoingElectionsWithWinners = async (req, res) => {
    try {
        const ongoingElections = await Election.find({ status: "ongoing" });

        const results = await Promise.all(
            ongoingElections.map(async (election) => {
                const votes = await Vote.aggregate([
                    { $match: { electionId: new mongoose.Types.ObjectId(election._id) } },
                    { $group: { _id: "$candidateId", voteCount: { $sum: 1 } } },
                    { $sort: { voteCount: -1 } },
                    {
                        $lookup: {
                            from: "candidates",
                            localField: "_id",
                            foreignField: "_id",
                            as: "candidate"
                        }
                    },
                    { $unwind: "$candidate" },
                    { $project: { candidateName: "$candidate.name", voteCount: 1 } },
                    { $limit: 1 }
                ]);

                const winner = votes.length > 0 ? votes[0] : null;

                return {
                    _id: election._id,
                    name: election.name,
                    startDate: election.startDate,
                    endDate: election.endDate,
                    status: election.status,
                    winner: winner || null
                };
            })
        );

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching ongoing elections with winners:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


