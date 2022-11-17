const express = require("express");
const ordersController = require("../controller/orders_controller");
const router = express.Router();

router
  .route("/")
  .get(ordersController.getAllOrder)
  .post(ordersController.createOrder);

router
  .route("/:id")
  .get(ordersController.getOrder)
  .delete(ordersController.deleteOrder);
  
  router
  .route("/customer/:customerId")
  .get(ordersController.getUserOrder)

  module.exports=router;