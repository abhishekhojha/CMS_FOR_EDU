const express = require("express");
const { body, validationResult } = require("express-validator");
const Section = require("../models/SectionSchema");
const Page = require("../models/Page");
const sectionTypes = require("../configs/sectionTypes.json").types;
const router = express.Router();

// ✅ Create or Update multiple sections for a page
router.post(
  "/",
  [
    body("pageId").notEmpty().withMessage("Page ID is required"),
    body("sections").isArray().withMessage("Sections must be an array"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { pageId, sections } = req.body;
      const page = await Page.findById(pageId);
      if (!page) return res.status(404).json({ error: "Page not found" });

      const sectionIds = [];

      for (const sectionData of sections) {
        let section;
        if (sectionData._id) {
          section = await Section.findByIdAndUpdate(
            sectionData._id,
            sectionData,
            { new: true }
          );
        } else {
          section = new Section({ ...sectionData, pageId });
          await section.save();
        }
        sectionIds.push(section._id);
      }

      page.sections = sectionIds;
      await page.save();

      res
        .status(200)
        .json({ message: "Sections created/updated successfully", sectionIds });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Get all sections for a page
router.get("/:pageId", async (req, res) => {
  try {
    const sections = await Section.find({ pageId: req.params.pageId });
    console.log(req.params);
    
    res.status(200).json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete multiple sections by ID
router.delete("/", async (req, res) => {
  try {
    const { sectionIds } = req.body;
    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({ error: "Provide valid section IDs." });
    }

    await Section.deleteMany({ _id: { $in: sectionIds } });

    await Page.updateMany(
      { sections: { $in: sectionIds } },
      { $pull: { sections: { $in: sectionIds } } }
    );

    res.status(200).json({ message: "Sections deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
