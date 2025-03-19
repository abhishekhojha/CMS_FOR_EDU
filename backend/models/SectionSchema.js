const mongoose = require("mongoose");

const sectionTypes = require("../configs/sectionTypes.json").types;

const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: sectionTypes.map((t) => t.name),
  },
  content: {
    type: String,
    required: function () {
      return ["paragraph", "heading1", "heading2", "heading3", "quote", "code", "preformatted"].includes(this.type);
    },
  },
  items: {
    type: [mongoose.Schema.Types.Mixed], // Supports arrays of strings (lists) or objects (tables)
    required: function () {
      return ["list", "orderedList", "table"].includes(this.type);
    },
    validate: {
      validator: function (v) {
        if (["list", "orderedList"].includes(this.type)) {
          return Array.isArray(v) && v.every((item) => typeof item === "string");
        }
        if (this.type === "table") {
          return Array.isArray(v) && v.every((row) => Array.isArray(row) && row.every((cell) => typeof cell === "string"));
        }
        return true;
      },
      message: (props) => `Invalid structure for type ${props.instance.type}.`,
    },
  },
  maxItems: {
    type: Number,
    required: function () {
      return ["list", "orderedList"].includes(this.type);
    },
    min: 1,
  },
  html_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: function () {
      return sectionTypes.find((t) => t.name === this.type)?.hasUrl || false;
    },
  },
  altText: {
    type: String,
    required: function () {
      return sectionTypes.find((t) => t.name === this.type)?.hasAltText || false;
    },
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page",
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  elements: [elementSchema], // Stores multiple elements inside a section
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

sectionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Section", sectionSchema);
