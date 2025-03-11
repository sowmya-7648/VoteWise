const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Corrected import
const { createElection, getElections, getOngoingElections } = require("../controllers/election.controller");

const router = express.Router();

// 📌 **Public route to fetch all elections**
router.get("/", getElections);

// 📌 **Admin-only route to create an election**
router.post("/create", authMiddleware, createElection);
router.get("/ongoing", getOngoingElections);

module.exports = router;
