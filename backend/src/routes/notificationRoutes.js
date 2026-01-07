const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  getUnreadCount,
  markAllRead,
} = require("../controllers/notificationController");

router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/mark-read", protect, markAllRead);

module.exports = router;
