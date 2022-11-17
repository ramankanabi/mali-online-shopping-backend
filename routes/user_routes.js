const express = require("express");
const authController = require("../controller/auth_controller");
const userController = require("../controller/user_controller");
const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUser
  );
  router
  .route("/phone/:phoneNumber")
  .get(
    userController.getUserByPhone
  );
  router
  .route("/id/:id")
  .get(
    userController.getUserById
  );

router
  .route("/signup")
  .post(authController.validatePhoneNumber,authController.signUp);

router
  .route("/login")
  .post(authController.validatePhoneNumber, authController.login);

module.exports = router;
