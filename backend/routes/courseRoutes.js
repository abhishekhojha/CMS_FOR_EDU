const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const router = express.Router();

router.post("/", upload.single("image"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.put("/:id", upload.single("image"), updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
