const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

// Load env variables
dotenv.config();

// Connect database
connectDB();

const app = express();

/* ===========================
   GLOBAL MIDDLEWARE
=========================== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===========================
   ROUTES
=========================== */
const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const userRoutes = require("./src/routes/userRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", require("./src/routes/reviewRoutes"));
app.use("/api/job-status", require("./src/routes/jobStatusRoutes"));

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", (req, res) => {
  res.send("WORKZO Backend Running");
});

/* ===========================
   SERVER START
=========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
