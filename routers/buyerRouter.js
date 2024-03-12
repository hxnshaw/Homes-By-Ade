const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
} = require("../controllers/buyerController");

router.post("/buyers/signup", registerBuyer);

router.post("/buyers/login", loginBuyer);

router.post("/buyers/logout", logoutBuyer);

module.exports = router;
