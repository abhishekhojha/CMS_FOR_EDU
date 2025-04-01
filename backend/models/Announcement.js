const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          enum: ["image", "pdf"],
          required: true,
        },
      },
    ],
    recipients: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
