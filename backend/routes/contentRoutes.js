const express = require("express");
const { verifyAdmin, verifySession } = require("../models/verification.js");
const {
  createSection,
  fetchSections,
} = require("../controllers/contentController.js");
const router = express.Router();

router.post(
  "/create-section",
  express.json({ type: "application/json" }),
  verifyAdmin,
  createSection
);

router.get("/fetch-section", fetchSections);

module.exports = router;
