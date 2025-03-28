const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getAllOrders,
} = require("../controllers/orderController");
const hasRole = require("../middleware/Auth");

const protect = require("../middleware/authMiddleware");
const Order = require("../models/Order")

// Route to create order
router.post("/create-order", protect, createOrder);

// Route to verify payment
router.post("/verify-payment", verifyPayment);
router.get("/", hasRole, getAllOrders);
// Get purchased courses for a user
router.get("/purchased-courses",protect ,async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId, status: "paid" })
      .populate("course")
      .sort({ paymentDate: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No purchased courses found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
