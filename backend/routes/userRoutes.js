const express = require("express");
const router = express.Router();
const {
  checkUser,
  newUser,
  setData,
  verifySession,
  handleLogout,
  handleDataUpdate,
  updateSensitiveData,
} = require("../controllers/userController.js");

router.post("/signin", checkUser);

router.post("/createuser", newUser);

router.post("/logout", handleLogout);

router.get("/set-data", verifySession, setData);

router.post("/update", handleDataUpdate);

router.post("/update-sensitive-data", verifySession, updateSensitiveData);

module.exports = router;
