const Notification = require("../models/Notification");
const Order = require("../models/Order");

// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const { courseId, message } = req.body;

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

    const notification = new Notification({
      course: courseId,
      message,
      recipients,
    });
    await notification.save();

    res.status(201).json({ message: "Notification created successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Notifications for a User
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ "recipients.user": userId })
      .sort({ createdAt: -1 })
      .select("message createdAt recipients.isRead");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, "recipients.user": userId },
      { $set: { "recipients.$.isRead": true } },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found or not for this user." });
    }

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Unread Notification Count
exports.getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.countDocuments({
      "recipients.user": userId,
      "recipients.isRead": false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
