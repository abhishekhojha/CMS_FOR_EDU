const express = require("express");
const {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
} = require("../controllers/promoCodeController");
const hasRole = require("../middleware/Auth");

const router = express.Router();

router.post("/", hasRole, createPromoCode);
router.get("/", hasRole, getAllPromoCodes);
router.get("/:id", hasRole, getPromoCodeById);
router.put("/:id", hasRole, updatePromoCode);
router.delete("/:id", hasRole, deletePromoCode);

module.exports = router;
