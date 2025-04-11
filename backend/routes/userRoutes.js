const express = require("express");
const router = express.Router();
const { verifySession } = require("../models/verification.js");
const {
  checkUser,
  newUser,
  fetchData,
  handleLogout,
  handleDataUpdate,
  updateSensitiveData,
  checkUserStatus,
} = require("../controllers/userController.js");

router.post("/signin", express.json({ type: "application/json" }), checkUser);

router.get(
  "/auth-status",
  verifySession,
  express.json({ type: "application/json" }),
  checkUserStatus
);

router.post("/createuser", express.json({ type: "application/json" }), newUser);

router.post(
  "/logout",
  verifySession,
  express.json({ type: "application/json" }),
  handleLogout
);

router.post(
  "/fetch-data",
  verifySession,
  express.json({ type: "application/json" }),
  fetchData
);

router.post(
  "/update",
  verifySession,
  express.json({ type: "application/json" }),
  handleDataUpdate
);

router.post("/update-sensitive-data", verifySession, updateSensitiveData);

module.exports = router;
