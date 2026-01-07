const Application = require("../models/Application");
const JobStatus = require("../models/JobStatus");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// ============================
// APPLY FOR JOB (WORKER)
// ============================
const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.status !== "OPEN") {
      return res.status(400).json({ message: "Job not available" });
    }

    const existing = await Application.findOne({
      job: job._id,
      worker: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: job._id,
      worker: req.user._id,
      status: "APPLIED",
    });

    // 🔔 NOTIFY EMPLOYER WHEN WORKER APPLIES
    await Notification.create({
      user: job.employer,
      message: `${req.user.name} applied for your job "${job.title}"`,
      type: "NEW_APPLICATION",
      link: `/dashboard/my-jobs/${job._id}/applicants`,
      read: false,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("APPLY JOB ERROR:", error.message);
    res.status(500).json({ message: "Failed to apply for job" });
  }
};

// ============================
// MY APPLICATIONS (WORKER)
// ============================
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      worker: req.user._id,
    }).populate({
      path: "job",
      populate: {
        path: "employer",
        select: "name email phoneNumber",
      },
    });

    res.json(apps);
  } catch (error) {
    console.error("GET MY APPLICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// ============================
// JOB APPLICATIONS (EMPLOYER)
// ============================
const getJobApplications = async (req, res) => {
  try {
    const apps = await Application.find({
      job: req.params.jobId,
    }).populate("worker", "name email phoneNumber");

    res.json(apps);
  } catch (error) {
    console.error("GET JOB APPLICATIONS ERROR:", error.message);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

// ============================
// ACCEPT APPLICATION (EMPLOYER)
// ============================
const acceptApplication = async (req, res) => {
  console.log("✅ ACCEPT APPLICATION HIT:", req.params.id);

  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("worker");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Employer authorization check
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Prevent double accept
    if (application.status === "ACCEPTED") {
      return res.status(400).json({ message: "Already accepted" });
    }

    // Update application
    application.status = "ACCEPTED";
    await application.save();

    // ✅ CREATE JOB STATUS (ONLY ON ACCEPT)
    await JobStatus.create({
      job: application.job._id,
      employer: req.user._id,
      worker: application.worker._id,
      status: "IN_PROGRESS",
    });

    // 🔔 NOTIFY WORKER
    await Notification.create({
      user: application.worker._id,
      message: `You have been accepted for "${application.job.title}"`,
      type: "JOB_ACCEPTED",
      link: "/dashboard/job-status",
    });

    res.json({ message: "Application accepted" });
  } catch (error) {
    console.error("ACCEPT APPLICATION ERROR:", error.message);
    res.status(500).json({ message: "Failed to accept application" });
  }
};

// ============================
// REJECT APPLICATION (EMPLOYER)
// ============================
const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("worker");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = "REJECTED";
    await application.save();

    // Notify worker
    await Notification.create({
      user: application.worker._id,
      message: `Your application for "${application.job.title}" was rejected`,
      type: "JOB_REJECTED",
      link: "/dashboard/applications",
    });

    res.json({ message: "Application rejected" });
  } catch (error) {
    console.error("REJECT APPLICATION ERROR:", error.message);
    res.status(500).json({ message: "Failed to reject application" });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  acceptApplication,
  rejectApplication,
};
