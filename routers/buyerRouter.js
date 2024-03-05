const express = require("express");
const router = express.Router();
const { registerBuyer, loginBuyer } = require("../controllers/buyerController");

router.post("/buyers/signup", registerBuyer);

router.post("/buyers/login", loginBuyer);

module.exports = router;
