const express = require("express");
const {
  uploadImageController,
  deleteImageController,
} = require("../controllers/cloudinaryController");
const hasRole = require("../middleware/Auth");
const router = express.Router();
const Image = require("../models/Image");
router.get("/", hasRole, async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const images = await Image.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalImages = await Image.countDocuments();

    res.status(200).json({
      images,
      totalImages,
      currentPage: page,
      totalPages: Math.ceil(totalImages / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/upload", hasRole, uploadImageController);
router.delete("/delete/:id", hasRole, deleteImageController);

module.exports = router;
