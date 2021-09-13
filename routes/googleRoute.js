const express = require("express");
const router = express();
const passport = require("passport");
const mongoose = require("mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../config/userSchema");
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.use(passport.initialize());
// middleware to use ejs template engine
router.set("view engine", "ejs");
router.use(express.static("public"));

function getUserByEmail(email){
    return User.findOne({ username: email });
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      const  user = await getUserByEmail(profile.emails[0].value);
      try{
          if (!user) {
            const user = new User({
              name: profile.displayName,
              username: profile.emails[0].value
            });
            user.save((err) => {
              if (err) {
                console.log(err);
              } else {
                return done(err, user);
              }
            });
          } else {
            return done(err, user);
          }}
          catch(err){
              return done(err)
          }
        }
  ));

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/secrets",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  function (req, res) {
    console.log("success");
    // Successful authentication, redirect home.
    res.redirect("/secret");
  }
);

module.exports = router;
