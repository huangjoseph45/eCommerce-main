const express = require("express");
const router = express.Router();

const {
  createProduct,
  fetchProduct,
  fetchCategory,
} = require("../controllers/productController.js");

router.post("/create-product", createProduct);
router.get("/fetch-product/:sku", fetchProduct);
router.get("/fetch/:category", fetchCategory);

module.exports = router;
