const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const PostModel = require("../models/post");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(UserModel.authenticate()));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Register Page" });
});

router.get("/login", function (req, res, next) {
  console.log(req.flash("error"));
  res.render("login", { error: req.flash("error") });
});

router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile", { title: "Profile" });
});

router.get("/feed", function (req, res, next) {
  res.render("feed", { title: "Feed" });
});
router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new UserModel({
    username,
    email,
    fullname,
  });

  UserModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
