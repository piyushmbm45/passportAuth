const express = require('express')
const router = express()
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../config/userSchema')


router.use(express.json());
router.use(express.urlencoded({
    extended: true
}))

router.use(passport.initialize());
// middleware to use ejs template engine
router.set('view engine', 'ejs')
router.use(express.static("public"));



passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username: username})
    .then(async (user) => {
        console.log(user);
        if (!user) { return done(null, false)}

         const isValid = await validPassword(password, user.password);
        console.log(`is valid part ${isValid}`);
        if (isValid) {
            return done(null, user);
        }else{
            return done(null, false);
        }})
    .catch((err)=>{
            done(err)
        })
    
}))


async function validPassword(user_pwd,db_pwd){
    const value = await bcrypt.compare(user_pwd,db_pwd)
    console.log(`valid password value is ${value}`);
    return value;
}


router.get('/register', (req, res) => {
    res.render('register')
    //     // showing user to register on app to see the secret page
})

router.post('/register', async (req, res) => {
    const nameIn = req.body.name;
    const passwordIn = req.body.password;
    // console.log(nameIn);
    const hash = await bcrypt.hash(passwordIn, saltRounds);
    const newUser = await new User({
        name: nameIn,
        username: req.body.username,
        password: hash
    });
    newUser.save((err) => {
        if (!err) {
            res.render('secret')
        } else {
            res.redirect('/register');
        }
    })
    // create new user in db
    // save the user credentials in db
    // show the secret page
})





// for login route
router.get('/login', (req, res) => {
    // showing user to enter their username and password 
    res.render('login')
})
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
    session: false
}), (req, res) => {
    console.log("log in success");
    res.render('secret')
    //     //     const userName= req.body.username;
    //     //     const password = req.body.password;
    //     // get the username and password from the user
    //     // authenticate it
    //     // if correct the render it to secret
    //     // otherwise send it to login page
})

module.exports = router;