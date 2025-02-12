const express = require("express");
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  handleCheckout,
  syncProducts,
  webhook,
  getOrders,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post(
  "/checkout",
  verifySession,
  express.json({ type: "application/json" }),
  handleCheckout
);

router.post(
  "/sync-products",
  verifyAdmin,
  express.json({ type: "application/json" }),
  syncProducts
);

router.post("/order", express.json({ type: "application/json" }), getOrders);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

module.exports = router;
