const { json } = require("express");
const Cart = require("../model/cart_model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerfactory");
const mongoose = require("mongoose");
exports.createCart = factory.createOne(Cart);
exports.updateCart = catchAsync(async (req, res, next) => {
  const subTotalPrice = req.body.quantity * req.body.price;
  const updateCart = await Cart.findOneAndUpdate(
    { customerId: req.params.customerId },
    {
      $push: {
        products: {
          productName: req.body.productName,
          productId: req.body.productId,
          images: req.body.images,
          quantity: req.body.quantity,
          size: req.body.size,
          price: req.body.price,
          subTotalPrice: subTotalPrice,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCart) {
    return next(new AppError("add new prouct to cart is unsuccessful", 404));
  }
  res.status(201).json({
    message: "success",
    data: updateCart,
  });
  next();
});

exports.getCart = catchAsync(async (req, res, next) => {
  const data = await Cart.findOne({ customerId: req.params.customerId });

  const priceCalculation = await Cart.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: req.params.customerId,
        subTotalPrice: { $sum: "$products.subTotalPrice" },
        deliveryFee: { $first: req.body.deliveryFee },
      },
    },
  ]);

  if (!data) {
    return next(new AppError("A cart doesn't find", 404));
  }
  res.status(200).json({
    status: "success",
    data,
    priceCalculation,
  });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  const cartDoc = await Cart.findOneAndUpdate(
    {
      "products._id": req.params.objectId,
    },
    {
      $set: {
        "products.$.quantity": req.body.quantity,
      },
    },
    {
      new: true,
    }
  );
  const price = await Cart.findOneAndUpdate(
    {
      "products._id": req.params.objectId,
    },
    { $set: { subTotalPrice: { $mul: { "$products.quantity": "$products.price" } } } }
  );
  if (!cartDoc) {
    return next(new AppError("We cant find this cart", 404));
  }

  res.json(cartDoc);

  next();
});
exports.getAllCart = factory.getAll(Cart);
exports.deleteCart = catchAsync(async (req, res, next) => {
  const doc = await Cart.findOneAndDelete({
    customerId: req.params.customerId,
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

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
  const cartDoc = await Cart.updateOne(
    {},
    {
      $pull: {
        products: { _id: mongoose.Types.ObjectId(req.params.objectId) },
      },
    }
  );

  res.json(cartDoc);
  next();
});
