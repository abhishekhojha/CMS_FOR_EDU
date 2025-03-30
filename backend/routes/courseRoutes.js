const express = require("express");
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
const hasRole = require("../middleware/Auth");

const router = express.Router();

router.post("/", hasRole, createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.put("/:id", hasRole, updateCourse);
router.delete("/:id", hasRole, deleteCourse);
module.exports = router;
