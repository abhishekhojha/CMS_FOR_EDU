const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/orderController');
// const { hasRole } = require('../middleware/Auth');

// Route to create order
router.post('/create-order', createOrder);

// Route to verify payment
router.post('/verify-order', verifyPayment);

module.exports = router;