const { uploadImage, deleteImage } = require("../utils/cloudinary");
const Image = require("../models/Image");

// Upload Image
exports.uploadImageController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await uploadImage(req.file.path);
    const newImage = new Image({
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    });

    await newImage.save();
    res
      .status(200)
      .json({ message: "Image uploaded and saved to DB", newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Image
exports.deleteImageController = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) return res.status(404).json({ error: "Image not found" });

    await deleteImage(image.imagePublicId);
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted from Cloudinary and DB" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
