const express = require("express");
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotificationCount,
} = require("../controllers/notificationController");
const protect = require("../middleware/authMiddleware");
const hasRole = require("../middleware/Auth");
const router = express.Router();

// Notification CRUD
router.post("/", hasRole, createNotification); // Create Notification
router.get("/", protect, getUserNotifications); // Get User Notifications
router.put("/:id/read", protect, markNotificationAsRead); // Mark Notification as Read
router.delete("/:id", hasRole, deleteNotification); // Delete Notification
router.get("/unread-count", protect, getUnreadNotificationCount); // Unread Notification Count

module.exports = router;
