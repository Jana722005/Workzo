const JobStatus = require("../models/JobStatus");
const Application = require("../models/Application");
const User = require("../models/User");
const Review = require("../models/Review");

// ============================
// CREATE JOB STATUS (ON ACCEPT)
// ============================
const createJobStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.appId)
      .populate("job");

    if (!application || application.status !== "ACCEPTED") {
      return res.status(400).json({ message: "Invalid application" });
    }

    const exists = await JobStatus.findOne({
      job: application.job._id,
      worker: application.worker,
    });

    if (exists) return res.json(exists);

    const status = await JobStatus.create({
      job: application.job._id,
      employer: application.job.employer,
      worker: application.worker,
      status: "IN_PROGRESS",
    });

    res.json(status);
  } catch (error) {
    console.error("CREATE JOB STATUS ERROR:", error.message);
    res.status(500).json({ message: "Failed to create job status" });
  }
};

// ============================
// GET MY JOB STATUSES
// ============================
const getMyJobStatuses = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "EMPLOYER") {
      query.employer = req.user._id;
    }

    if (req.user.role === "WORKER") {
      query.worker = req.user._id;
    }

    const statuses = await JobStatus.find(query)
      .populate("job", "title category location")
      .populate("worker", "name rating completedJobs")
      .populate("employer", "name");

    res.json(statuses);
  } catch (error) {
    console.error("JOB STATUS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch job status" });
  }
};

// ============================
// COMPLETE JOB + REVIEW + RATING
// ============================
const completeJob = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const jobStatus = await JobStatus.findById(req.params.id)
      .populate("job")
      .populate("worker");

    if (!jobStatus) {
      return res.status(404).json({ message: "Job status not found" });
    }

    // Only employer can complete
    if (jobStatus.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (jobStatus.status === "COMPLETED") {
      return res.status(400).json({ message: "Already completed" });
    }

    // ✅ Mark job completed
    jobStatus.status = "COMPLETED";
    jobStatus.completedAt = new Date();
    await jobStatus.save();

    // ✅ Save review (if rating provided)
    if (rating && rating >= 1 && rating <= 5) {
      await Review.create({
        worker: jobStatus.worker._id,
        employer: req.user._id,
        job: jobStatus.job._id,
        rating,
        comment: review,
      });

      // 🔢 Recalculate average rating
      const reviews = await Review.find({
        worker: jobStatus.worker._id,
      });

      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      // ✅ Update worker stats
      await User.findByIdAndUpdate(jobStatus.worker._id, {
        rating: avgRating,
        reviewCount: reviews.length,
        $inc: { completedJobs: 1 },
      });
    } else {
      // Still increment completed jobs even without rating
      await User.findByIdAndUpdate(jobStatus.worker._id, {
        $inc: { completedJobs: 1 },
      });
    }

    res.json({ message: "Job completed and review saved" });
  } catch (error) {
    console.error("JOB COMPLETE ERROR:", error.message);
    res.status(500).json({ message: "Failed to complete job" });
  }
};

module.exports = {
  createJobStatus,
  getMyJobStatuses,
  completeJob,
};
