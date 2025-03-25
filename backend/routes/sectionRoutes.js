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
async function mergeAndUpdateSection(sectionId, updatedElements) {
  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    // Convert elements to a map for easy lookup
    const dbElementMap = new Map(
      section.elements.map((el) => [el._id.toString(), el])
    );

    // Ensure updatedElements is an array
    if (!Array.isArray(updatedElements)) {
      throw new Error("updatedElements must be an array");
    }

    // Merge updated elements with missing fields from DB
    for (const element of updatedElements) {
      const elementId = element._id;
      if (!elementId) continue; // Skip if no _id

      const dbElement = dbElementMap.get(elementId.toString());

      if (dbElement) {
        const updateFields = {};

        for (const [key, value] of Object.entries(element)) {
          if (key === "_id") continue; // Skip _id

          // Handle dynamic items[index] update
          const match = key.match(/^items\[(\d+)\]$/);
          if (match) {
            const index = parseInt(match[1], 10);
            updateFields[`elements.$.items.${index}`] = value;
          } else {
            // Regular field update (e.g., content, url, altText)
            updateFields[`elements.$.${key}`] = value;
          }
        }
        if (Object.keys(updateFields).length > 0) {
          await Section.updateOne(
            { _id: sectionId, "elements._id": elementId },
            { $set: updateFields }
          );
        }
      }
    }
    console.log("Section updated successfully");
    return await Section.findById(sectionId);
  } catch (error) {
    console.error("Error updating section:", error);
    throw error;
  }
}
router.put(
  "/merge-update",
  [
    body("sectionId").notEmpty().withMessage("Section ID is required"),
    body("elements").isArray().withMessage("Elements must be an array"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { sectionId, elements } = req.body;
      await mergeAndUpdateSection(sectionId, elements);

      // for (const updatedElement of elements) {
      //   await mergeAndUpdateSection(sectionId, updatedElement);
      // }

      res
        .status(200)
        .json({ message: "Elements merged and updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
module.exports = router;
