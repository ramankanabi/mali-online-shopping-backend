const admin = require("firebase-admin");
const credential = require("../firebase-admin.json");
const jwt = require("jsonwebtoken");
const User = require("../model/user_model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

admin.initializeApp({
  credential: admin.credential.cert(credential),
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city,
    birthYear: req.body.birthYear,
  });
  console.log(newUser);
  createSendToken(newUser, 201, req, res);
  next();
});

exports.login = async (req, res, next) => {
  // const phoneNumber = res.local.phoneNumber;
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber) {
    return next(new AppError("check the phone number"), 404);
  }

  const user = await User.findOneAndUpdate(
    { phoneNumber: phoneNumber },
    {
      loginDate: Date.now(),
    },
    { new: true, runValidators: true }
  );

  //   if (!user || !(await user.correctPassword(password, user.password))) {
  if (!user) {
    return next(new AppError("check the phone number", 401));
  }
  createSendToken(user, 200, req, res);
};

exports.protect = catchAsync(async (req, res, next) => {
  //getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not loged ! please login to get access.")
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(
      new AppError("the user belonging to this token does no longer exist")
    );
  }

  if (parseInt(currentUser.loginDate.getTime() / 1000, 10) > decode.iat) {
    return next(new AppError("this token has been expired"));
  }

  req.user = currentUser;
  next();
});

exports.validatePhoneNumber = catchAsync(async (req, res, next) => {
  const phoneNumberIsValid = await admin.auth().verifyIdToken(req.body.token);

  if (!phoneNumberIsValid) {
    next(new AppError("Please verify the phone number", 400));
  }
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError("you have not permission to do this acion", 403)
      );
    }
    next();
  };
};
