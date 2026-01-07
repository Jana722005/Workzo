const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get(
  "/browse-jobs",
  protect,
  authorizeRoles("WORKER"),
  (req, res) => {
    res.json({
      message: "Worker job browsing access granted",
      user: req.user,
    });
  }
);

module.exports = router;
