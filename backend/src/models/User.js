const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ SINGLE SOURCE OF TRUTH FOR EMAIL VERIFICATION
    emailVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["EMPLOYER", "WORKER"],
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    // ======================
    // WORKER-ONLY FIELDS
    // ======================
    skills: {
      type: [String],
      default: [],
    },

    categories: {
      type: [String],
      default: [],
    },

    about: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
    },

    // ======================
    // REPUTATION
    // ======================
    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    completedJobs: { 
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
