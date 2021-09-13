const express = require("express");
const router = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../config/userSchema");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')

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

// ------ form method for logout - delete method at the POST method
router.use(methodOverride('_method'))


const getUserByEmail = (username) => {
  return User.findOne({ username: username });
};

const authenticateUser = async (username, password, done) => {
  const user = await getUserByEmail(username);
  if (user === null) {
    return done(null, false, { message: "No user Found with email" });
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password Not Match" });
    }
  } catch (err) {
    return done(err);
  }
};

passport.use(
  new LocalStrategy({ usernameField: "username" }, authenticateUser)
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


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
      res.redirect("/register");
    }
  });
});

router.get('/',checkNotAuthenticated,(req,res)=>{
  res.render('home')
})

// for login route
router.get("/login", checkNotAuthenticated,(req, res) => {
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
    req.flash()
    res.redirect("/secret");
  }
);

// need authenticated user to see our secret route
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

// if user already logged in then we dont want to show him register and login route
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect('/secret')
  }
  next()
}

// --------logout route
router.delete('/logout',(req,res,next)=>{
  req.logOut()
  res.redirect('/login')
})


// secret route
router.get('/secret',checkAuthenticated,(req,res)=>{
  res.render('secret')
})

module.exports = router;