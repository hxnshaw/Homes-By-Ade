const express = require("express");
const router = express.Router();
const {
  registerBuyer,
  loginBuyer,
  logoutBuyer,
  viewSingleBuyer,
  viewMyBuyerProfile,
  updateBuyerPassword,
  updateBuyerDetails,
  deleteBuyerProfile,
} = require("../controllers/buyerController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authentication");

//create a new buyer account
router.post("/buyers/signup", registerBuyer);

//login buyer
router.post("/buyers/login", loginBuyer);

//logout buyer
router.post("/buyers/logout", logoutBuyer);

//view buyer profile
router
  .route("/buyers/view-my-dashboard")
  .get(authenticateUser, authorizePermissions("buyer"), viewMyBuyerProfile);

//buyer route to update password
router
  .route("/buyers/view-my-dashboard/update-password")
  .put(authenticateUser, updateBuyerPassword);

//buyer route to update personal details
router
  .route("/buyers/view-my-dashboard/update-profile")
  .put(authenticateUser, updateBuyerDetails);

//delete buyer account
router
  .route("/buyers/view-my-dashboard/delete-account")
  .delete(
    authenticateUser,
    authorizePermissions("admin", "buyer"),
    deleteBuyerProfile
  );

//admin route to view a buyer's account
router
  .route("/buyers/find-buyer/:id")
  .get(authenticateUser, authorizePermissions("admin"), viewSingleBuyer);

module.exports = router;
