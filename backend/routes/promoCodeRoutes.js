const express = require("express");
const {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
} = require("../controllers/promoCodeController");
const hasRole = require("../middleware/Auth");
const PromoCode = require("../models/PromoCode");

const router = express.Router();

router.post("/", hasRole, createPromoCode);
router.get("/", hasRole, getAllPromoCodes);
router.get("/:id", hasRole, getPromoCodeById);
router.put("/:id", hasRole, updatePromoCode);
router.delete("/:id", hasRole, deletePromoCode);
router.get("/apply/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const promoCode = await PromoCode.findOne({ code });
    console.log(code,promoCode);
    
    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.status(200).json(promoCode);
  } catch (error) {
    console.error("Error fetching promo code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
