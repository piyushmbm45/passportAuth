const bcrypt = require("bcrypt");
const saltRounds = 10;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../utils/userSchema");
// const logger = require("../utils/logger");

function initialize(passport) {
  const getUserByEmail = (username) => {
    return User.findOne({ username: username });
  };

  const authenticateUser = async (username, password, done) => {
    const user = await getUserByEmail(username);
      console.log(user);
      console.log(user.password);
      console.log(user.password == undefined);
    try {
      if (user === null) {
        return done(null, false, {
          message: "No user Found with this email id",
        });
      } else if (user.password == undefined) {
        return done(null, false, { message: "User already exists" });
      } else if (await bcrypt.compare(password, user.password)) {
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
    done(null, user._id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
