const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);