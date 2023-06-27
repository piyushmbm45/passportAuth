const express = require("express");
const router = express();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../utils/userSchema");
const FACEBOOK_APP_ID = process.env.APP_ID;
const FACEBOOK_APP_SECRET = process.env.APP_SECRET;

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
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "https://userauth45.herokuapp.com/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne(
        {
          username: profile.emails[0].value,
        },
        (err, user) => {
          if (err) {
            return cb(err);
          }
          if (!user) {
            const user = new User({
              username: profile.emails[0].value,
              name: profile.displayName,
            });
            user.save((err) => {
              if (err) {
                console.log(err);
              } else {
                return cb(null, user);
              }
            });
          } else {
            return cb(null, user);
          }
        }
      );
    }
  )
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    // successRedirect: "/secret",
    session: true,
  }),(req,res)=>{
    console.log(req.session);
    res.redirect('/secret')
  }
);

module.exports = router;
