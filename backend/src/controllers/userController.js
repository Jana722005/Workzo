const User = require("../models/User");

/* ===========================
   GET LOGGED-IN USER PROFILE
=========================== */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

/* ===========================
   UPDATE LOGGED-IN PROFILE
=========================== */
const updateMyProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Employer views worker profile
const getWorkerProfile = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select(
      "-password"
    );

    if (!worker || worker.role !== "WORKER") {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch worker profile" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getWorkerProfile,
};
