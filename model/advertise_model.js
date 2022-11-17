const mongoose = require("mongoose");

const advertiseSchema = mongoose.Schema(
  {
    advertiseTitle: {
      type:String,
      required: [true, "An advertise must have Title."],
    },

    duration:{
        type:Date,
        required: [true, "An advertise  must have duration."],
    },
    imageCover:{
        type:String,
        required: [true, "An advertise  must have Image Cover."],
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


const advertise = mongoose.model("advertises", advertiseSchema);

module.exports = advertise;
