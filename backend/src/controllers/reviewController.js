const Review = require("../models/Review");
const User = require("../models/User");
const JobStatus = require("../models/JobStatus");

// ============================
// CREATE REVIEW (EMPLOYER)
// ============================
const createReview = async (req, res) => {
  try {
    const { workerId, rating, comment } = req.body;

    if (!workerId || !rating) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 1️⃣ Save review (force rating to Number)
    await Review.create({
      employer: req.user._id,
      worker: workerId,
      rating: Number(rating),
      comment,
    });

    // 2️⃣ Get all reviews for this worker
    const reviews = await Review.find({
      worker: workerId,
    });

    // ⚠️ IMPORTANT: reviews MUST exist
    if (reviews.length === 0) {
      return res.json({ message: "Review saved" });
    }

    // 3️⃣ Calculate average
    const totalRating = reviews.reduce(
      (sum, r) => sum + Number(r.rating),
      0
    );

    const avgRating = Number(
      (totalRating / reviews.length).toFixed(1)
    );

    // 4️⃣ Update worker profile
    await User.findByIdAndUpdate(workerId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    res.json({ message: "Review submitted & rating updated" });
  } catch (err) {
    console.error("RATING UPDATE ERROR:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

// ============================
// GET WORKER REVIEWS (PUBLIC)
// ============================
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      worker: req.params.workerId,
    })
      .populate("employer", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch {
    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

// 🔑 CRITICAL EXPORT (DO NOT CHANGE)
module.exports = {
  createReview,
  getWorkerReviews,
};
