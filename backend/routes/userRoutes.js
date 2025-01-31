const express = require("express");
const router = express.Router();
const {
  checkUser,
  newUser,
  fetchData,
  verifySession,
  handleLogout,
  handleDataUpdate,
  updateSensitiveData,
} = require("../controllers/userController.js");

router.post("/signin", checkUser);

router.post("/createuser", newUser);

router.post("/logout", handleLogout);

router.post("/fetch-data", verifySession, fetchData);

router.post("/update", verifySession, handleDataUpdate);

router.post("/update-sensitive-data", verifySession, updateSensitiveData);

module.exports = router;
