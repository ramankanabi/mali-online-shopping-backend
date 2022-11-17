const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: [true, "A favourite product must have product id."],
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: [true, "A favourite product must have product id."],
    },

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
favouriteSchema.virtual("product", {
  ref: "products",
  foreignField: "_id",
  localField: "productId",
});

const Favourite = mongoose.model("favourites", favouriteSchema);

module.exports = Favourite;
