const Product = require("../model/product_model");
const factory = require("./handlerfactory");
const multer = require("multer");
const sharp = require("sharp");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  req.product = product._id;
  next();
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadImage = upload.fields([{ name: "images", maxCount: 3 }]);
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();
  // 2) Images
  const imagesAray = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.product}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/productImages/${filename}`);

      imagesAray.push(filename);
    })
  );
  console.log(imagesAray);
  const product = await Product.findByIdAndUpdate(
    req.product,
    {
      images: imagesAray,
    },
    { new: true }
  );

  res.status(201).json({
    message: "success",
    data: {
      product,
    },
  });

  next();
});

exports.getProduct = factory.getOne(Product);
exports.getAllProducts = factory.getAll(Product);

  (exports.updateProduct = factory.updateOne(Product));

exports.insertRelatedProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        relatedProduct: [
          {
            productId: req.body.productId,
            images: req.body.images,
          },
        ],
      },
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    message: "success",
    data: { product },
  });
});

exports.deleteRelatedProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { relatedProduct: { productId: req.params.relatedProductId } },
    },
    {
      new: true,
      multi: true,
    }
  );

  res.status(201).json({
    message: "success",
    data: { product },
  });
});

exports.search = catchAsync(async (req, res, next) => {
  const product = await Product.find({
    productName: { $regex: req.params.searchField },
  });

  res.status(200).json({
    message: "success",
    result: product.length,
    data: product,
  });
});
