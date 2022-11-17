const express = require("express");
const productsController = require("../controller/products_controller");
const authController = require("../controller/auth_controller");

const router = express.Router();

router
  .route("/")
  .post(
    // authController.protect,
    // authController.restrictTo("admin", "moderator"),
    productsController.createProduct,
    productsController.uploadImage,
    productsController.resizeTourImages
  )
  .get(productsController.getAllProducts);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    productsController.updateProduct
  )
  .get(productsController.getProduct);

router
  .route("/:id/relatedproduct")
  .patch(
    // authController.protect,
    // authController.restrictTo("admin", "moderator"),
    productsController.insertRelatedProduct
  );

router
  .route("/:id/relatedproduct/:relatedProductId")
  .delete(
    authController.protect,
    authController.restrictTo("admin", "moderator"),
    productsController.deleteRelatedProduct
  );

router.route("/search/:searchField").get(productsController.search);

module.exports = router;
