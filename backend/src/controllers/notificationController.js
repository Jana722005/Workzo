const Notification = require("../models/Notification");

// GET notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

// GET unread count (HEADER USES ONLY THIS)
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false,
    });

    res.json({ count });
  } catch {
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

// MARK ALL AS READ (ONLY notifications page)
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Failed to mark read" });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAllRead,
};
