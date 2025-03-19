const express = require("express");
const { body, validationResult } = require("express-validator");
const Page = require("../models/Page");
const Section = require("../models/SectionSchema");
const router = express.Router();

/* 🚀 CREATE PAGE */
router.post(
  "/",
  [
    body("title").isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("description").optional().isLength({ max: 300 }).withMessage("Description max 300 characters"),
    body("createdBy").notEmpty().withMessage("CreatedBy is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newPage = new Page(req.body);
      const savedPage = await newPage.save();
      res.status(201).json(savedPage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* 📖 READ ALL PAGES */
router.get("/", async (req, res) => {
  try {
    const pages = await Page.find().populate('createdBy', 'name');
    res.status(200).json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 📖 READ PAGE BY ID */
router.get("/:id", async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).populate("sections");
    if (!page) return res.status(404).json({ error: "Page not found" });

    res.status(200).json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✏️ UPDATE PAGE */
router.put(
  "/:id",
  [
    body("title").optional().isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters"),
    body("description").optional().isLength({ max: 300 }).withMessage("Description max 300 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedPage) return res.status(404).json({ error: "Page not found" });

      res.json(updatedPage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

/* 🗑️ DELETE PAGE */
router.delete("/:id", async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });

    // Delete all sections linked to this page
    await Section.deleteMany({ pageId: req.params.id });

    // Delete the page itself
    await Page.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Page and its sections deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;