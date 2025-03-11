const Election = require("../models/Election");

// 📌 **Create an election (Admin only)**
exports.createElection = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;
        const election = new Election({ name, description, startDate, endDate });
        await election.save();
        res.status(201).json({ message: "Election created successfully!", election });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 **Get all elections (Public)**
exports.getElections = async (req, res) => {
    try {
        const elections = await Election.find();
        res.status(200).json(elections);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 📌 **Function to update election status dynamically**
const updateElectionStatus = async () => {
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
};

// 📌 **Get Ongoing Elections**
exports.getOngoingElections = async (req, res) => {
    try {
        await updateElectionStatus(); // Ensure statuses are updated

        const ongoingElections = await Election.find({ status: "ongoing" });

        res.status(200).json(ongoingElections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ongoing elections", error: error.message });
    }
};

// ✅ **Export all controllers correctly**

