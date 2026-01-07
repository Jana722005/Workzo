const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getWorkerReviews,
} = require("../controllers/reviewController");

// Employer submits review
router.post("/", protect, createReview);

// Public: get worker reviews
router.get("/:workerId", getWorkerReviews);

module.exports = router;
