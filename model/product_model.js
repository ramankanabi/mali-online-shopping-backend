const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "A product must have a name"],
      trim: true,
      maxlength: [40, "A shop name must have less or equal then 40 characters"],
      minlength: [10, "A shop name must have more or equal then 10 characters"],
    },
    shopName: {
      type: String,
      required: [true, "A product must have a shop name"],
      trim: true,
      maxlength: [40, "A shop name must have less or equal then 40 characters"],
    },
    customerPrice: {
      type: Number,
      required: [true, "A product must have a customer price"],
    },
    originalPrice: {
      type: Number,
      required: [true, "A product must have a original price"],
      select: false,
    },
    size: [String],
    color:   {
      type: String,
      required:true,
    },
    relatedProduct: [
      {
        productId: { type: mongoose.Schema.ObjectId, ref: "products" },
        images: [String],
      },
    ],
    description_en: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "A tour name must have less or equal then 200 characters",
      ],
    },
    description_ku: {
      type: String,
      trim: true,
      maxlength: [
        500,
        "A tour name must have less or equal then 200 characters",
      ],
    },
    productLocation: {
      type: String,
      required: [true, "A product must have a location"],
    },
    productCity: {
      type: String,
      required: [true, "A product must have a city"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.customerPrice;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
      default:0
    },
    images: [String],
    category: String,
    localDeliveryPrice: Number,
    globalDeliveryPrice: Number,
    isAvailable: Boolean,
    weather: {
      typeof: String,
      enum: ["winter", "summer"],
    },
    quantity:{
type:Number,
required:[true,"A product should have quantity"]
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const product = mongoose.model("products", productSchema);

module.exports = product;



