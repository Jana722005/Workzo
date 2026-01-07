const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.post(
  "/post-job",
  protect,
  authorizeRoles("EMPLOYER"),
  (req, res) => {
    res.json({
      message: "Employer job posting access granted",
      user: req.user,
    });
  }
);

module.exports = router;
