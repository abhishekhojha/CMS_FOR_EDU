const Course = require("../models/Course");
const cloudinary = require("cloudinary").v2;

// Create Course
exports.createCourse = async (req, res) => {
  try {
    let imageUrl = "",
      imagePublicId = "";
    if (req.file) {
        
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }
    const course = new Course({ ...req.body, imageUrl, imagePublicId });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
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

    if (req.file) {
      if (course.imagePublicId) {
        await cloudinary.uploader.destroy(course.imagePublicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.imageUrl = result.secure_url;
      req.body.imagePublicId = result.public_id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
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
