const express = require("express");
const favouriteController = require("../controller/favourite_controller");
const authContoller = require("../controller/auth_controller");
const router = express.Router();

router
  .route("/")
  .post(
    authContoller.protect,
    authContoller.restrictTo("admin", "moderator", "user"),
    favouriteController.createFavourite
  )
  .get(favouriteController.getAllFavourite);

  router
  .route("/:userId")
  .get(
    // authContoller.protect,
    // authContoller.restrictTo("admin", "moderator", "user"),
    favouriteController.getUserAllFavourites
  );

  router
  .route("/product/:productId")
  .get(
    favouriteController.getProductAllFavourites
  );

  router
  .route("/:userId/product/:productId")
  .get(
    authContoller.protect,
    authContoller.restrictTo("admin", "moderator", "user"),
    favouriteController.getFavourite
  );

  router
  .route("/:userId/product/:productId")
  .delete(
    authContoller.protect,
    authContoller.restrictTo("admin", "moderator", "user"),
    favouriteController.deleteFavourite
  );

module.exports = router;
