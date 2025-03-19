const express = require("express");
const { body, validationResult } = require("express-validator");
const Section = require("../models/SectionSchema");
const Page = require("../models/Page");
const sectionTypes = require("../configs/sectionTypes.json").types;
const router = express.Router();

// ✅ Create a new section with elements
router.post(
  "/",
  [
    body("pageId").notEmpty().withMessage("Page ID is required"),
    body("title")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be 3-100 characters"),
    body("order").isInt({ min: 1 }).withMessage("Order must be a positive number"),
    body("elements").isArray().withMessage("Elements must be an array"),
    body("elements.*.type")
      .isIn(sectionTypes.map((t) => t.name))
      .withMessage("Invalid element type"),
    body("elements.*.content").optional().isString(),
    body("elements.*.html_id").notEmpty().withMessage("HTML ID is required"),
    body("elements.*.url")
      .optional()
      .isString()
      .custom((value, { req, path }) => {
        const index = path.match(/\d+/)[0];
        const elementType = req.body.elements[index].type;
        const typeDef = sectionTypes.find((t) => t.name === elementType);
        if (typeDef?.hasUrl && !value) {
          throw new Error("URL is required for this element type");
        }
        return true;
      }),
    body("elements.*.altText")
      .optional()
      .isString()
      .custom((value, { req, path }) => {
        const index = path.match(/\d+/)[0];
        const elementType = req.body.elements[index].type;
        const typeDef = sectionTypes.find((t) => t.name === elementType);
        if (typeDef?.hasAltText && !value) {
          throw new Error("AltText is required for this element type");
        }
        return true;
      }),
    body("elements.*.items")
      .optional()
      .isArray()
      .custom((value, { req, path }) => {
        const index = path.match(/\d+/)[0];
        const elementType = req.body.elements[index].type;
        if (["list", "orderedList", "table"].includes(elementType) && !Array.isArray(value)) {
          throw new Error("Items must be an array for list or table elements");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { pageId } = req.body;
      const page = await Page.findById(pageId);
      if (!page) return res.status(404).json({ error: "Page not found" });

      const newSection = new Section(req.body);
      const savedSection = await newSection.save();

      page.sections.push(savedSection._id);
      await page.save();

      res.status(201).json(savedSection);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Get all sections
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().populate("pageId");
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get section by ID
router.get("/:id", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate("pageId");
    if (!section) return res.status(404).json({ error: "Section not found" });

    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update section
router.put("/:id", async (req, res) => {
  try {
    const updatedSection = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSection) return res.status(404).json({ error: "Section not found" });

    res.json(updatedSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete section
router.delete("/:id", async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);
    if (!deletedSection) return res.status(404).json({ error: "Section not found" });

    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
