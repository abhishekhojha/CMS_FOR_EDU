const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const protect = require("../middleware/authMiddleware");
const hasRole = require("../middleware/Auth");
const router = express.Router();
const sendOTPEmail = require("../middleware/Mailer");

// ✅ Register or Resend OTP
router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("phone")
      .matches(/^[0-9]{10}$/)
      .withMessage("Phone number must be 10 digits"),
    body("alternatePhone")
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage("Alternate phone number must be 10 digits"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, alternatePhone } = req.body;
    const alternate_Phone = alternatePhone || null;
    
    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        if (user.isVerified) {
          return res.status(400).json({
            error: "User already registered and verified. Please login.",
          });
        }
        // Resend OTP for unverified users
        const otp = user.generateOTP();
        await user.save();
        await sendOTPEmail(email, otp);
        console.log(user.isVerified);

        return res.status(200).json({
          message:
            "User already exists but not verified. OTP resent to your email.",
        });
      }

      // Create new user and send OTP
      user = new User({ name, email, password, phone, alternate_Phone });
      const otp = user.generateOTP();
      await user.save();
      await sendOTPEmail(email, otp);

      res.status(201).json({
        message: "Account created. OTP sent to your email for verification.",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
// ✅ Login user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      if (!user.isVerified)
        return res.status(403).json({
          error:
            "Account not verified. Please verify using the OTP sent to your email.",
        });

      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
// ✅ Verify OTP
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    const { email, otp } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (user.isVerified)
        return res.status(400).json({ message: "User already verified." });

      if (user.verifyOTP(otp)) {
        await user.save();
        return res.status(200).json({
          message: "OTP verified successfully. Your account is now verified.",
        });
      } else {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Get user profile (Protected)
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get All Users
router.get("/all", hasRole, async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      success: true,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ err: error });
  }
});
module.exports = router;
