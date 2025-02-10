const express = require("express");
const router = express.Router();
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  createProduct,
  fetchProduct,
  fetchCategory,
} = require("../controllers/productController.js");

router.post("/create-product", verifyAdmin, createProduct);
router.get("/fetch-product/:sku", verifySession, fetchProduct);
router.get("/fetch/:category", fetchCategory);

module.exports = router;
