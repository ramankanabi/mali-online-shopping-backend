const Order = require("../model/orders_model");
const factory = require("./handlerfactory");
const catchAsync = require("../utils/catchAsync");
exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrder = factory.getAll(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.getUserOrder = catchAsync(async (req, res, next) => {
  const doc = await Order.find({ customerId: req.params.customerId });
 

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    result:doc.length,
    data: {
      data: doc,
    },
  });
});
