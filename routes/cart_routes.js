const express = require("express");
const cartController = require("../controller/cart_controller");
const authController=require("../controller/auth_controller");
const router = express.Router();

router
  .route("/")
  .get(cartController.getAllCart)
  .post(cartController.createCart);

router
  .route("/:customerId")
  .get(authController.protect,cartController.getCart)
  .patch(cartController.updateCart)
  .delete(authController.protect,cartController.deleteCart);

router
  .route("/:customerId/product/:objectId")
  .patch(cartController.updateQuantity).delete(cartController.removeProductFromCart);
module.exports = router;
