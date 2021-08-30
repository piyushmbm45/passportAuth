const express = require('express');
const router = express();
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserGoogle = require('../config/userSchemaForGoogle');
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

router.use(express.json());
router.use(express.urlencoded({
    extended: true
}))

router.use(passport.initialize());
// middleware to use ejs template engine
router.set('view engine', 'ejs')
router.use(express.static("public"));


passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets"
    },
    function (accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        UserGoogle.findOne({
            id: profile.id
        }, (err, user) => {
            if (err) {
                return cb(err)
            }
            if (!user) {
                const user = new UserGoogle({
                    id: profile.id,
                    name: profile.displayName,
                    photo: profile.photos[0].value
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


router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    }));

router.get('/auth/google/secrets',
    passport.authenticate('google', {
        failureRedirect: '/home',
        session: false
    }),
    function (req, res) {
        console.log("success");
        // Successful authentication, redirect home.
        res.render('secret');
    });

module.exports = router;