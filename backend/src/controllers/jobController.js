const Job = require("../models/Job");

// ============================
// CREATE JOB (EMPLOYER)
// ============================
const createJob = async (req, res) => {
  try {
    const { title, description, category, location, memberLimit } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      memberLimit: memberLimit || 1,
      employer: req.user._id,
      status: "OPEN",
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
};

// ============================
// GET ALL JOBS (WORKER)
// ============================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "OPEN" }).populate(
      "employer",
      "name location email phoneNumber"
    );

    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// ============================
// GET MY JOBS (EMPLOYER)
// ============================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Failed to fetch your jobs" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
};
