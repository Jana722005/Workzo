const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const jobController = require("../controllers/jobController");

// Employer
router.post("/", protect, jobController.createJob);
router.get("/my", protect, jobController.getMyJobs);

// Worker
router.get("/", protect, jobController.getJobs);

module.exports = router;
