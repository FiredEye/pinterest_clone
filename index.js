const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressSession = require("express-session");
const passport = require("passport");
const express = require("express");
const flash = require("connect-flash");
require("dotenv").config();
const app = express();

const mongoose = require("mongoose");

const userModel = require("./models/user");
// const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(flash());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hoyy",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(userRoutes);
app.use(indexRoutes);

mongoose
  .connect(process.env.DB_CONNECT)
  .then(async () => {
    app.listen(5000, () => {
      console.log("server running");
    });
  })
  .catch((err) => console.log(err));
