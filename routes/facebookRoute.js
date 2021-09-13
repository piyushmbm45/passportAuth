const express = require('express');
const router = express();
const passport = require('passport');
const mongoose = require('mongoose');
const FacebookStrategy = require('passport-facebook').Strategy;
const UserFacebook = require('../config/userSchemaForFacebook');
const FACEBOOK_APP_ID = process.env.APP_ID;
const FACEBOOK_APP_SECRET = process.env.APP_SECRET;

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}))

router.use(passport.initialize());
// middleware to use ejs template engine
router.set('view engine', 'ejs')
router.use(express.static("public"));


passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        UserFacebook.findOne({
            id: profile.id
        }, (err, user) => {
            if (err) {
                return cb(err)
            }
            if (!user) {
                const user = new UserFacebook({
                    id: profile.id,
                    name: profile.displayName
                });
                user.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        return cb(err, user)
                    }
                })
            } else {
                return cb(err, user)
            }
        })

    }));


router.get('/auth/facebook',
    passport.authenticate('facebook',{scope: ['profile', 'email']}));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/home',
        session: false
    }),
    function (req, res) {
        console.log("success");
        // Successful authentication, redirect home.
        res.render('secret');
    });

module.exports = router;