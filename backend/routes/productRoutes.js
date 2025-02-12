const express = require("express");
const router = express.Router();
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  createProduct,
  fetchProduct,
  fetchCategory,
  findPromo,
  createDiscount,
} = require("../controllers/productController.js");

router.post(
  "/create-product",
  express.json({ type: "application/json" }),
  verifyAdmin,
  createProduct
);
router.get("/fetch-product/:skuComplete", verifySession, fetchProduct);
router.get("/fetch/:query", fetchCategory);
router.get("/discount/:code", findPromo);
router.post(
  "/discount/create",
  express.json({ type: "application/json" }),
  createDiscount
);

module.exports = router;
