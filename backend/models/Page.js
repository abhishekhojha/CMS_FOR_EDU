const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], minlength: 3, maxlength: 100, unique: true },
    slug: { type: String, required: [true, "Slug is required"], unique: true },
    description: { type: String, maxlength: 300 },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    meta: {
      title: { type: String, maxlength: 100 },
      description: { type: String, maxlength: 200 },
      keywords: [{ type: String }],
    },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Page", PageSchema);
