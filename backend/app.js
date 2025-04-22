require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const cors = require("cors");

const userRoutes = require("./routes/user.route");
const electionRoutes = require("./routes/election.route");
const candidateRoutes = require("./routes/candidate.route");
const voteRoutes = require("./routes/vote.route"); // Assuming vote system

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes); // Voting system routes

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.use("/images", express.static(path.join(__dirname, "images")));

// Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
