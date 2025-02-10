const express = require("express");
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  handleCheckout,
  checkoutSuccess,
  syncProducts,
  webhook,
  getOrder,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post(
  "/checkout",
  verifySession,
  express.json({ type: "application/json" }),
  handleCheckout
);

router.post(
  "/success",
  express.json({ type: "application/json" }),
  checkoutSuccess
);

router.post(
  "/sync-products",
  verifyAdmin,
  express.json({ type: "application/json" }),
  syncProducts
);

router.get("/order/:id", getOrder);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

module.exports = router;
