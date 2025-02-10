const express = require("express");
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  handleCheckout,
  checkoutSuccess,
  syncProducts,
} = require("../controllers/stripeController.js");

const router = express.Router();

router.post("/checkout", verifySession, handleCheckout);

router.post("/success", checkoutSuccess);

router.post("/sync-products", verifyAdmin, syncProducts);

module.exports = router;
