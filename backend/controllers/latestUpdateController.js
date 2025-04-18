const LatestUpdate = require("../models/latestUpdate");

// ✅ Create Latest Update
exports.createUpdate = async (req, res) => {
  try {
    const { title, description, imageUrl, link, isLive, category } = req.body;
    const newUpdate = new LatestUpdate({
      title,
      description,
      category,
      imageUrl,
      link,
      isLive,
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
    const { category, page = 1, limit = 10 } = req.query;

    // Create filter for category if provided
    const filter = category ? { category } : {};

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Fetch updates with pagination
    const updates = await LatestUpdate.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Get total count for pagination info
    const totalUpdates = await LatestUpdate.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: updates,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUpdates / limitNumber),
      totalUpdates,
    });
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
