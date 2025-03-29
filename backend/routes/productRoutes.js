const express = require("express");
const router = express.Router();
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  createProduct,
  fetchProduct,
  fetchCategory,
  findPromo,
  createDiscount,
  fetchTopProducts,
} = require("../controllers/productController.js");

router.post(
  "/create-product",
  express.json({ type: "application/json" }),
  verifyAdmin,
  createProduct
);
router.get(
  "/fetch-product/:skuComplete/:test?",
  express.json({ type: "application/json" }),
  fetchProduct
);

router.post("/fetch-top", fetchTopProducts);

router.post("/fetch", fetchCategory);
router.get("/discount/:code", findPromo);
router.post(
  "/discount/create",
  express.json({ type: "application/json" }),
  createDiscount
);

module.exports = router;
