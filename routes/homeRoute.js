const express = require('express');
const router = express();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../utils/userSchema');
const flash = require('express-flash');
// const methodOverride = require("method-override");

const initializePassport = require('../middleware/passportLocalConfig');
initializePassport(passport);

router.use(flash());

// middleware to use ejs template engine
// router.set("view engine", "ejs");
// router.use(express.static("public"));

router.use(passport.initialize());
router.use(passport.session());

// ------ form method for logout - delete method at the place of POST method
// router.use(methodOverride("_method"));

router.post('/', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, saltRounds);
  const newUser = await new User({
    name: req.body.name,
    username: req.body.username,
    password: hash,
  });
  newUser.save((err) => {
    if (!err) {
      req.flash('info', 'You are registered Now You can login');
      res.redirect('/login');
    } else {
      if (err.code === 11000) {
        req.flash('info', 'User Already Exist');
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    }
  });
});

router.get('/', checkNotAuthenticated, (req, res) => {
  res.render('home');
});

// for login route
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    session: true,
  }),
  (req, res) => {
    console.log(req.session);
    res.redirect('/secret');
  }
);

// --------logout route
router.post('/logout', (req, res, next) => {
  const email = req.user.username;
  console.log(email);
  User.findOneAndUpdate(
    { username: email },
    { last_login: Date.now() },
    async (err, user) => {
      if (err) {
        console.log(err);
      } else {
        await user.save();
      }
    }
  );
  req.logOut();
  console.log(req.session);
  res.redirect('/');
});

// secret route
router.get('/secret', checkAuthenticated, (req, res) => {
  res.render('secret', { user: req.user });
});

// need authenticated user to see our secret route
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// if user already logged in then we dont want to show him register and login route
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/secret');
  }
  next();
}

module.exports = router;
