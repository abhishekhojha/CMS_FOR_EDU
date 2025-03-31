const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
} = require("../controllers/courseController");
const hasRole = require("../middleware/Auth");
const Course = require("../models/Course");
const router = express.Router();

router.post("/", hasRole, createCourse);
router.get("/", getCourses);
router.get("/all", getAllCourses);

router.get("/:id", getCourse);
router.put("/:id", hasRole, updateCourse);
router.delete("/:id", hasRole, deleteCourse);
router.patch("/:id/:status/unpublish", async (req, res) => {
  try {
    const { id, status } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { unPublish: status },
      { new: true }
    );

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course unpublished successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
