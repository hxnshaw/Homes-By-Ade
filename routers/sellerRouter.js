const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  viewSingleSeller,
  viewMySellerProfile,
} = require("../controllers/sellerController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

router.post("/sellers/signup", registerSeller);

router.post("/sellers/login", loginSeller);

router
  .route("/sellers/logout")
  .post(authenticateUser, authorizePermissions("seller"), logoutSeller);

router
  .route("/sellers/view-my-dashboard")
  .get(authenticateUser, authorizePermissions("seller"), viewMySellerProfile);

router
  .route("/sellers/find-seller/:id")
  .get(authenticateUser, authorizePermissions("admin"), viewSingleSeller);

module.exports = router;
