const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], minlength: 3 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+@.+\..+/, "Invalid email"],
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    alternatePhone: {
      type: String,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate OTP
UserSchema.methods.generateOTP = function () {
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
  return otp;
};

// ✅ Verify OTP
UserSchema.methods.verifyOTP = function (enteredOTP) {
  if (this.otp === enteredOTP && this.otpExpiry > Date.now()) {
    this.isVerified = true;
    this.otp = undefined; // Clear OTP after verification
    this.otpExpiry = undefined;
    return true;
  }
  return false;
};

module.exports = mongoose.model("User", UserSchema);
