const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  try {
    console.log(filePath);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      resource_type: "auto" // Organize  in a folder
    });
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true, message: "Image deleted successfully" };
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw error;
  }
};

module.exports = { uploadImage, deleteImage };
