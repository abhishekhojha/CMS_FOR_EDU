const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getAllOrders,
} = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

// Route to create order
router.post("/create-order", protect, createOrder);

// Route to verify payment
router.post("/verify-order", protect, verifyPayment);
router.get("/", getAllOrders);

module.exports = router;
