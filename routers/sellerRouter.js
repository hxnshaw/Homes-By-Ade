const express = require("express");
const router = express.Router();
const {
  registerSeller,
  loginSeller,
  logoutSeller,
  getAllSellers,
  viewSingleSeller,
  viewMySellerProfile,
  updateSellerDetails,
  updateSellerPassword,
  deleteSellerProfile,
  deleteSellerProfileByAdmin,
} = require("../controllers/sellerController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

//create a new seller account
router.post("/sellers/signup", registerSeller);

//login registered seller
router.post("/sellers/login", loginSeller);

//logout seller
router
  .route("/sellers/logout")
  .post(authenticateUser, authorizePermissions("seller"), logoutSeller);

//Admin route to view all registered sellers
router
  .route("/sellers/view-all-sellers")
  .get(authenticateUser, authorizePermissions("admin"), getAllSellers);

//view seller profile or dashboard
router
  .route("/sellers/view-my-dashboard")
  .get(authenticateUser, authorizePermissions("seller"), viewMySellerProfile);

//update seller details
router
  .route("/sellers/view-my-dashboard/update-profile")
  .put(authenticateUser, authorizePermissions("seller"), updateSellerDetails);

//update seller password
router
  .route("/sellers/view-my-dashboard/update-password")
  .put(authenticateUser, authorizePermissions("seller"), updateSellerPassword);

//delete seller account
router
  .route("/sellers/view-my-dashboard/delete-account")
  .delete(
    authenticateUser,
    authorizePermissions("admin", "seller"),
    deleteSellerProfile
  );

//Admin route to delete seller account
router
  .route("/sellers/find-seller/delete-account/:id")
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    deleteSellerProfileByAdmin
  );

//Admin route to view a seller
router
  .route("/sellers/find-seller/:id")
  .get(authenticateUser, authorizePermissions("admin"), viewSingleSeller);

module.exports = router;
