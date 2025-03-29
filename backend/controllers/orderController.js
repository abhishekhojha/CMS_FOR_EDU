const Order = require("../models/Order");
const Razorpay = require("razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const PromoCode = require("../models/PromoCode")
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
const createOrder = async (req, res) => {
  try {
    const { courseId, promoCode } = req.body;
    const userId = req.user.id;

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let amount = course.price * 100; // In paise (1 INR = 100 paise)
    let discountedAmount = amount;

    // Apply Promo Code if provided
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode,
        isActive: true,
      });

      if (!promo)
        return res
          .status(400)
          .json({ message: "Invalid or inactive promo code" });
      if (new Date(promo.expiryDate) < new Date())
        return res.status(400).json({ message: "Promo code expired" });

      const discount = (promo.discountPercentage / 100) * amount;
      const finalDiscount = promo.maxDiscount
        ? Math.min(discount, promo.maxDiscount * 100)
        : discount;

      discountedAmount = Math.max(amount - finalDiscount, 0);
    }

    // Create order in Razorpay
    const options = {
      amount: discountedAmount,
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    // Save order to the database
    const newOrder = new Order({
      user: userId,
      course: courseId,
      amount: amount / 100,
      discountedAmount: discountedAmount / 100,
      razorpayOrderId: order.id,
      promoCode: promoCode || null,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: discountedAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Verify Payment and Update Order Status
const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    // Fetch the order details from DB
    const order = await Order.findOne({ razorpayOrderId: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify the payment with Razorpay
    const paymentVerification = await razorpayInstance.payments.fetch(
      paymentId
    );

    if (paymentVerification.status === "captured") {
      // Update the order status to 'paid'
      order.status = "paid";
      order.razorpayPaymentId = paymentId;
      order.paymentDate = new Date();
      await order.save();
      const registrationDate = new Date();
      await User.findByIdAndUpdate(order.user, {
        $push: {
          courses: order.course,
          registrationDate: registrationDate,
        },
      });
      res.status(200).json({ success: true, message: "Payment Successful" });
    } else {
      // If payment is not captured
      res.status(400).json({ success: false, message: "Payment Failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    let { page, limit } = req.query;

    // Set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    // Fetch orders with pagination and populate user and course details
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();
    return res.status(200).json({
      success: true,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getAllOrders,
};
