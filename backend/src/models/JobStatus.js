const mongoose = require("mongoose");

const jobStatusSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
    rating: Number,
    review: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobStatus", jobStatusSchema);
