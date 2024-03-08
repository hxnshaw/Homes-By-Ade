const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginSeller,
} = require("../controllers/sellerController");

router.post("/sellers/signup", registerSeller);

router.post("/sellers/login", loginSeller);

module.exports = router;
