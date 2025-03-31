const LatestUpdate = require("../models/latestUpdate");

// ✅ Create Latest Update
exports.createUpdate = async (req, res) => {
  try {
    const { title, description, imageUrl, link, isActive } = req.body;

    const newUpdate = new LatestUpdate({
      title,
      description,
      imageUrl,
      link,
      isActive,
    });

    await newUpdate.save();
    res.status(201).json({ message: "Update created successfully", newUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Updates
exports.getAllUpdates = async (req, res) => {
  try {
    const updates = await LatestUpdate.find().sort({ createdAt: -1 });
    res.status(200).json(updates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Update by ID
exports.getUpdateById = async (req, res) => {
  try {
    const update = await LatestUpdate.findById(req.params.id);
    if (!update) return res.status(404).json({ error: "Update not found" });
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Latest Update
exports.updateUpdate = async (req, res) => {
  try {
    const update = await LatestUpdate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!update) return res.status(404).json({ error: "Update not found" });
    res.status(200).json({ message: "Update updated successfully", update });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete Update
exports.deleteUpdate = async (req, res) => {
  try {
    const update = await LatestUpdate.findByIdAndDelete(req.params.id);
    if (!update) return res.status(404).json({ error: "Update not found" });
    res.status(200).json({ message: "Update deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
