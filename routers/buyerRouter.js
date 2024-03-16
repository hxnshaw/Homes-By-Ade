const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
  viewSingleBuyer,
  viewMyBuyerProfile,
  updateBuyerPassword,
} = require("../controllers/buyerController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router.post("/buyers/signup", registerBuyer);

router.post("/buyers/login", loginBuyer);

router.post("/buyers/logout", logoutBuyer);

router
  .route("/buyers/view-my-dashboard")
  .get(authenticateUser, viewMyBuyerProfile);

router
  .route("/buyers/view-my-dashboard/update-password")
  .put(authenticateUser, updateBuyerPassword);

router
  .route("/buyers/find-buyer/:id")
  .get(authenticateUser, authorizePermissions("admin"), viewSingleBuyer);

module.exports = router;
