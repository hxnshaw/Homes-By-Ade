const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
  viewSingleBuyer,
  viewMyBuyerProfile
} = require("../controllers/buyerController");

router.post("/buyers/signup", registerBuyer);

router.post("/buyers/login", loginBuyer);

router.post("/buyers/logout", logoutBuyer);


router.route("/buyers/:id").get(viewSingleBuyer);

module.exports = router;
