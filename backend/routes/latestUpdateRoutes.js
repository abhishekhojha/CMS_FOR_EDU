const express = require("express");
const router = express.Router();
const {
  createUpdate,
  getAllUpdates,
  getUpdateById,
  updateUpdate,
  deleteUpdate,
} = require("../controllers/latestUpdateController");

// Routes
router.post("/", createUpdate);           // Create Update
router.get("/", getAllUpdates);           // Get All Updates
router.get("/:id", getUpdateById);        // Get Update by ID
router.put("/:id", updateUpdate);         // Update Update
router.delete("/:id", deleteUpdate);      // Delete Update

module.exports = router;
