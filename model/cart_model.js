const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.ObjectId, ref: "Users", unique: true },
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
          max: 11,
        },
        size: String,
        price: {
          type: Number,
          required: [true, "A product must have price"],
        },
        subTotalPrice: {
          type: Number,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


cartSchema.pre("save", async function (next) {
  await this.products.forEach((el, i) => {
    this.products[i].subTotalPrice =
      this.products[i].price * this.products[i].quantity;
  });
  next();
});




const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
