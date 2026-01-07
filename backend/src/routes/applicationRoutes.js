const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  applyJob,
  getMyApplications,
  getJobApplications,
  acceptApplication,
  rejectApplication,
} = require("../controllers/applicationController");

// ============================
// WORKER
// ============================

// Apply for a job
router.post("/:jobId", protect, applyJob);

// View my applications
router.get("/my", protect, getMyApplications);

// ============================
// EMPLOYER
// ============================

// View applicants for a job
router.get("/job/:jobId", protect, getJobApplications);

// Accept application (🔥 creates JobStatus + Notification)
router.patch("/accept/:id", protect, acceptApplication);

// Reject application (🔔 sends notification)
router.patch("/reject/:id", protect, rejectApplication);

module.exports = router;
