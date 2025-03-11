const express = require("express");
const { createCandidate, getCandidatesByElection } = require("../controllers/candidate.controller");

const router = express.Router();

// ✅ Route to get candidates by election ID
router.get("/election/:electionId", getCandidatesByElection);

// ✅ Route to create a new candidate
router.post("/create", createCandidate);


module.exports = router;
