const { json } = require("express");
const Advertise = require("../model/advertise_model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerfactory");
const mongoose = require("mongoose");

exports.createAdvertise = factory.createOne(Advertise);
exports.getAllAdvertise = factory.getAll(Advertise);

exports.getAdvertise = catchAsync(async (req, res, next) => {
  const data = await Advertise.findOne({ _id: req.params.advertiseId });

  if (!data) {
    return next(new AppError("A Advertise doesn't find", 404));
  }
  res.status(200).json({
    status: "success",
    data: { data },
  });
});

exports.deleteAdvertise = catchAsync(async (req, res, next) => {
  const doc = await Advertise.findOneAndDelete({
    _id: req.params.advertiseId,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });

  next();
});
exports.updateAdvertise = catchAsync(async (req, res, next) => {
  const advertise = Advertise.findByIdAndUpdate(
    req.params.advertiseId,
    req.body,
    { new: true, runValidators: true }
  );

  next();
});
