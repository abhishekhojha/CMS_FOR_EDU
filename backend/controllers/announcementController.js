const Announcement = require("../models/Announcement");
const Order = require("../models/Order");

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, content, attachments } = req.body;

    const orders = await Order.find({
      course: courseId,
      status: "paid",
    }).select("user");
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for this course." });
    }

    const recipients = orders.map((order) => ({
      user: order.user,
      isRead: false,
    }));

    const announcement = new Announcement({
      course: courseId,
      title,
      content,
      attachments,
      recipients,
    });
    await announcement.save();

    res.status(201).json({ message: "Announcement created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Announcements for a User
exports.getUserAnnouncements = async (req, res) => {
  try {
    const userId = req.user.id;

    const announcements = await Announcement.find({ "recipients.user": userId })
      .sort({ createdAt: -1 })
      .select("title content attachments createdAt recipients.isRead");

    await Announcement.updateMany(
      { "recipients.user": userId, "recipients.isRead": false },
      { $set: { "recipients.$.isRead": true } }
    );

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Announcements for Users
exports.getAllAnnouncements = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .select("title content attachments createdAt recipients.isRead")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalAnnouncements = await Announcement.countDocuments();

    res.status(200).json({
      announcements,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAnnouncements / limit),
      totalAnnouncements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Announcement as Read
exports.markAnnouncementAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const announcement = await Announcement.findOneAndUpdate(
      { _id: id, "recipients.user": userId },
      { $set: { "recipients.$.isRead": true } },
      { new: true }
    );

    if (!announcement) {
      return res
        .status(404)
        .json({ message: "Announcement not found or not for this user." });
    }

    res.status(200).json({ message: "Announcement marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    res.status(200).json({ message: "Announcement deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Unread Announcement Count
exports.getUnreadAnnouncementCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Announcement.countDocuments({
      "recipients.user": userId,
      "recipients.isRead": false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
