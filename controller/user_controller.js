const User = require("../model/user_model");
const factory = require("./handlerfactory");
const catchAsync = require("../utils/catchAsync");
const AppError=require("../utils/appError");

exports.getUserByPhone = catchAsync(async (req, res, next) => {
    const user = await User.findOne({phoneNumber:req.params.phoneNumber});

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  });

  exports.getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findOne({_id:req.params.id});

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  });
exports.getAllUser = factory.getAll(User);
