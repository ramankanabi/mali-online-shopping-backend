const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength:20,
    required: [true, "please tell us your name"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "please tell us your phone number"],
    trim: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  birthYear: Number,
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  loginDate: {
    type: Date,
    default: Date.now(),
  },
});



const User = mongoose.model("Users", userSchema);

module.exports = User;
