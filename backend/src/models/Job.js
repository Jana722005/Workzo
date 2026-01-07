const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    category: String,
    location: String,
    description: String,
    budget: Number,

    memberLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
