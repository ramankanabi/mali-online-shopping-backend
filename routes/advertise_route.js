const express = require("express");
const advertiseController = require("../controller/advertise_controller");
const router = express.Router();

router
  .route("/")
  .get(advertiseController.getAllAdvertise)
  .post(advertiseController.createAdvertise);

router
  .route("/:advertiseId")
  .get(advertiseController.getAdvertise)
  .patch(advertiseController.updateAdvertise)
  .delete(advertiseController.deleteAdvertise);


module.exports = router;
