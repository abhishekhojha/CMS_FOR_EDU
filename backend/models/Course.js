const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" }, // Optional: For Cloudinary image URL
    imagePublicId: { type: String, default: "" }, // For image deletion
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
