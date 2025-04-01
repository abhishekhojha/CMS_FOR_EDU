const express = require("express");
const {
  createAnnouncement,
  getUserAnnouncements,
  markAnnouncementAsRead,
  deleteAnnouncement,
  getUnreadAnnouncementCount,
  getAllAnnouncements,
} = require("../controllers/announcementController");
const protect = require("../middleware/authMiddleware");
const hasRole = require("../middleware/Auth");

const router = express.Router();

// Announcement CRUD
router.post("/", hasRole, createAnnouncement); // Create Announcement
router.get("/", protect, getUserAnnouncements); // Get User Announcements
router.get("/all", hasRole, getAllAnnouncements); // Get All Announcements

router.put("/:id/read", protect, markAnnouncementAsRead); // Mark Announcement as Read
router.delete("/:id", hasRole, deleteAnnouncement); // Delete Announcement
router.get("/unread-count", protect, getUnreadAnnouncementCount); // Unread Announcement Count

module.exports = router;
