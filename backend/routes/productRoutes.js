const express = require("express");
const router = express.Router();

const {
  createProduct,
  fetchProduct,
} = require("../controllers/productController.js");

router.post("/create-product", createProduct);
router.get("/fetch-product/:productId", fetchProduct);

module.exports = router;
