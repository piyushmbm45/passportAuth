const express = require("express");
const router = express();
const passport = require("passport");
const twitterStrategy = require("passport-twitter").Strategy;
const User = require("../utils/userSchema");
const TWITTER_APP_KEY = process.env.API_KEY;
const TWITTER_APP_KEY_SECRET = process.env.API_KEY_SECRET;

router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());
// middleware to use ejs template engine
router.set("view engine", "ejs");
router.use(express.static("public"));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new twitterStrategy(
    {
      consumerKey: TWITTER_APP_KEY,
      consumerSecret: TWITTER_APP_KEY_SECRET,
      callbackURL: "https://userauth45.herokuapp.com/auth/twitter/callback"
    },
    function (token, tokenSecret, profile, cb) {
      console.log(profile);
      console.log(profile.user.providerData[0].email);
      return cb(null, profile);
    }
  )
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    // successRedirect: "/secret",
    session: true,
  }),
  (req, res) => {
    res.redirect("/secret");
  }
);

module.exports = router;
