// controllers/contactController.js
const Contact = require("../models/Contact");

// Create Contact
exports.createContact = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Contacts with Pagination
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalContacts = await Contact.countDocuments();

    res.status(200).json({
      contacts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalContacts / limit),
      totalContacts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
