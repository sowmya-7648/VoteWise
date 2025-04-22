const express = require("express");
const router = express.Router();
const electionController = require("../controllers/election.controller");

// POST /api/elections
router.post("/", electionController.createElection);

// GET /api/elections
router.get("/", electionController.getElections);
router.get("/ongoing", electionController.getOngoingElections);
router.get("/status", electionController.getElectionsByStatus);
router.get("/ongoing-with-winners", electionController.getOngoingElectionsWithWinners);


module.exports = router;
