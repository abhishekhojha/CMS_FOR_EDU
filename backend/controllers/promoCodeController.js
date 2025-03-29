const PromoCode = require("../models/PromoCode");

// ➡️ Create Promo Code
exports.createPromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, maxDiscount, expiryDate, isActive } =
      req.body;

    const promoCode = new PromoCode({
      code,
      discountPercentage,
      maxDiscount,
      expiryDate,
      isActive,
    });

    await promoCode.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Promo code created successfully",
        promoCode,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➡️ Get All Promo Codes
exports.getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json({ success: true, promoCodes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➡️ Get Single Promo Code
exports.getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode)
      return res.status(404).json({ message: "Promo code not found" });

    res.status(200).json({ success: true, promoCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➡️ Update Promo Code
exports.updatePromoCode = async (req, res) => {
  try {
    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPromoCode)
      return res.status(404).json({ message: "Promo code not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Promo code updated successfully",
        updatedPromoCode,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➡️ Delete Promo Code
exports.deletePromoCode = async (req, res) => {
  try {
    const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);

    if (!deletedPromoCode)
      return res.status(404).json({ message: "Promo code not found" });

    res
      .status(200)
      .json({ success: true, message: "Promo code deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
