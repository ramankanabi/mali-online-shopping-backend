const Favourite = require("../model/favourite_model");
const factory = require("./handlerfactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.createFavourite = factory.createOne(Favourite);
exports.getAllFavourite = factory.getAll(Favourite, "product");
exports.deleteFavourite = catchAsync(async (req, res, next) => {
  const doc = await Favourite.findOneAndDelete({
    productId: req.params.productId,
    userId: req.params.userId,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getUserAllFavourites = catchAsync(async (req, res, next) => {
  const favourites = await Favourite.find({ userId: req.params.userId }).populate("product");

  if (!favourites) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: favourites,
    },
  });
});


exports.getProductAllFavourites = catchAsync(async (req, res, next) => {
  const favourites = await Favourite.find({ productId: req.params.productId });

  if (!favourites) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    result:favourites.length,
    data: {
      data: favourites,
    },
  });
});
exports.getFavourite = catchAsync(async (req, res, next) => {
  const favourites = await Favourite.findOne({
    userId: req.params.userId,
    productId: req.params.productId,
  });

  if (!favourites) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      favourites,
    },
  });
});
