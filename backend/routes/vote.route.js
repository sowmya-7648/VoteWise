const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { voteForCandidate, getElectionResults, getElectionWinner, getAllElectionResults, checkVoteStatus } = require("../controllers/vote.controller");

// Vote for a candidate (authenticated route)
router.post("/vote", authMiddleware, voteForCandidate);

// Get election results (unauthenticated route)
router.get("/results/:electionId", getElectionResults);
router.get("/results", getAllElectionResults);
router.get("/check-vote/:electionId", authMiddleware, checkVoteStatus)
router.get('/winner/:electionId', getElectionWinner);



module.exports = router;
