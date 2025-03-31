const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Announcement", "Counselling", "Courses", "Others"],
    },
    link: {
      type: String,
      default: null,
      validate: {
        validator: (v) => !v || /^https?:\/\/.+\..+/.test(v),
        message: "Invalid URL format",
      },
    },
    isLive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", updateSchema);