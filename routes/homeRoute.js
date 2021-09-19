const express = require("express");
const router = express();
const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../config/userSchema");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const initializePassport = require("../config/passportLocalConfig");
initializePassport(passport);

router.use(flash());
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);
// middleware to use ejs template engine
router.set("view engine", "ejs");
router.use(express.static("public"));

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

// ------ form method for logout - delete method at the place of POST method
router.use(methodOverride("_method"));

router.post("/", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = await new User({
    name: req.body.name,
    username: req.body.username,
    password: hash,
  });
  newUser.save((err) => {
    if (!err) {
      res.redirect("/secret");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/", checkNotAuthenticated, (req, res) => {
  res.render("home");
});

// for login route
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    req.flash();
    res.redirect("/secret");
  }
);

// need authenticated user to see our secret route
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// if user already logged in then we dont want to show him register and login route
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/secret");
  }
  next();
}

// --------logout route
router.delete("/logout", (req, res, next) => {
  req.logOut();
  res.redirect("/");
});

// secret route
router.get("/secret", checkAuthenticated, (req, res) => {
  res.render("secret");
});

module.exports = router;
