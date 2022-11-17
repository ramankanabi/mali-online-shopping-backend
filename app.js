const express = require("express");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const fs=require("fs");
const app = express();
app.enable("trust proxy");
app.use(compression());
const productsRoute = require("./routes/products_route");
const favouritesRoute = require("./routes/favourite_routes");
const userRoute = require("./routes/user_routes");
const ordersRoute = require("./routes/orders_routes");
const cartRoute = require("./routes/cart_routes");
const advertiseRoute = require("./routes/advertise_route");

app.use(express.json({ limit: "10kb" }));

app.use(cors());
app.options("*", cors());
app.use(helmet());

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP, please try again in an hour!",
// });
// app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());


app.use("/api/v1/products", productsRoute);
app.use("/api/v1/carts", cartRoute);
app.use("/api/v1/orders", ordersRoute);
app.use("/api/v1/favourites", favouritesRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/advertise",advertiseRoute);

app.use("/api/v1/image/:imagePath", (req,res,next)=>{
    const image=fs.readFileSync("./public/images/productImages/"+req.params.imagePath);
res.json(image);
});
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
//   // console.log("cant find this url");
// });

module.exports = app;
