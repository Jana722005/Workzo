const express = require("express");
const router = express.Router();

// ✅ correct middleware import (DO NOT destructure)
const protect = require("../middleware/authMiddleware");

// ✅ controller must export these exact functions
const {
  getMyJobStatuses,
  createJobStatus,
  completeJob,
} = require("../controllers/jobStatusController");

// ============================
// JOB STATUS ROUTES
// ============================

// Get job statuses (worker & employer dashboard)
router.get("/", protect, getMyJobStatuses);

// Create job status (used internally after accept — safe to keep)
router.post("/:appId", protect, createJobStatus);

// Employer marks job as completed
router.patch("/:id/complete", protect, completeJob);

module.exports = router;
