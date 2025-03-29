const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  maxDiscount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("PromoCode", promoCodeSchema);