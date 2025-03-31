const LatestUpdate = require("../models/latestUpdate");

// ✅ Create Latest Update
exports.createUpdate = async (req, res) => {
  try {
    const { title, description, imageUrl, link, isLive, category } = req.body;

    const newUpdate = new LatestUpdate({
      title,
      description,
      imageUrl,
      link,
      isLive,
      category,
    });

    await newUpdate.save();
    res.status(201).json({ message: "Update created successfully", newUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Updates (Optional Filtering by Category)
exports.getAllUpdates = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const updates = await LatestUpdate.find(filter).sort({ createdAt: -1 });
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
    const { title, description, imageUrl, link, isLive, category } = req.body;

    const update = await LatestUpdate.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, link, isLive, category },
      { new: true, runValidators: true }
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
