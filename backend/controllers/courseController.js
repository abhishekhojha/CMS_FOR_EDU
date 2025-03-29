const Course = require("../models/Course");
const cloudinary = require("cloudinary").v2;
const multiparty = require("multiparty");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      // Extract data from fields
      const title = fields.title ? fields.title[0] : null;
      const description = fields.description ? fields.description[0] : null;
      const price = fields.price ? fields.price[0] : null;

      if (!title || !description || !price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let imageUrl = "",
        imagePublicId = "";

      // Check if an image is uploaded
      if (files.image && files.image[0]) {
        const imagePath = files.image[0].path;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: "courses", // Organize images in a folder
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }

      // Save the course data to the database
      const course = new Course({
        title,
        description,
        price,
        imageUrl,
        imagePublicId,
      });
      await course.save();

      res.status(201).json({ message: "Course created successfully", course });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      const updatedData = {
        title: fields.title ? fields.title[0] : course.title,
        description: fields.description
          ? fields.description[0]
          : course.description,
        price: fields.price ? fields.price[0] : course.price,
      };

      // Handle image update if a new image is provided
      if (files.image && files.image[0]) {
        if (course.imagePublicId) {
          await cloudinary.uploader.destroy(course.imagePublicId); // Delete previous image
        }

        const result = await cloudinary.uploader.upload(files.image[0].path, {
          folder: "courses", // Organize images in a folder
        });
        updatedData.imageUrl = result.secure_url;
        updatedData.imagePublicId = result.public_id;
      }

      // Update the course in the database
      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Course updated successfully", updatedCourse });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.imagePublicId) {
      await cloudinary.uploader.destroy(course.imagePublicId);
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
