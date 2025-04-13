const express = require("express");

const {
  sendEmail,
  addToMailingList,
} = require("../controllers/mediaController.js");
const router = express.Router();

router.post(
  "/mailinglist-add",
  express.json({ type: "application/json" }),
  addToMailingList
);

module.exports = router;
