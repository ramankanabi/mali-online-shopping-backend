const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.ObjectId, ref: "Users" },
  products: [
    {
      productName: String,
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "products",
        required: [true, "Cart must belong to a product."],
      },
      images: [String],
      quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 5,
      },
      size: String,
      price: {
        type: Number,
        required: [true, "A product must have price"],
      },
      subTotalPrice: {
        type: Number,
        required: [true, "A products must have sub total price"],
      },
    },
  ],
  phoneNumber: {
    type: String,
    required: [true, "An order must have a phone number"],
  },
  city: {
    type: String,
    required: [true, "An order must have a city"],
  },
  location: {
    type: String,
    required: [true, "An order must have a location"],
  },
  deliveryPrice:{
    type:Number,
    default:"3000"
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  arriveDate:{
    type: Date,
    default:Date(Date.now() + 1000 * 60 * 60 * 12),
  },
  isArrived:{
    type:Boolean,
    default:false,
  }
});

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
