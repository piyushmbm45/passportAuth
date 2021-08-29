require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const PORT = process.env.PORT || 3000;
const saltRounds = 10;


const app = express();
// middle for express url and body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// middleware to use ejs template engine
app.set('view engine', 'ejs')
app.use(express.static("public"));
// mongodb connection
const uri = process.env.DB_URL
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log("Database Connected Successfully");
    } else {
        console.log(err);
    }
})

const userSchema = new Schema({
    name: String,
    username: String,
    password: String
})

const User = new mongoose.model('User', userSchema);


// home page route
app.get('/home', (req, res) => {
    res.render('index')
})


// for register route

app.get('/register', (req, res) => {
    res.render('register')
    // showing user to register on app to see the secret page
})

app.post('/register', (req, res) => {
    const nameIn = req.body.name;
    const passwordIn = req.body.password;
    console.log(nameIn);
    bcrypt.hash(passwordIn,saltRounds, (err, hash) => {
        const newUser = new User({
            name: nameIn,
            username: req.body.username,
            password: hash
        })
        newUser.save((err)=>{
            if(!err){
                res.render('secret')
            }else{
                res.redirect('/register');
            }
        });
    });

    // create new user in db
    // save the user credentials in db
    // show the secret page
})





// for login route
// app.get('/login',(req,res)=>{
// showing user to enter their username and password 
//     res.render('login')
// })
// app.post('/login',(req,res)=>{
//     const userName= req.body.username;
//     const password = req.body.password;
// get the username and password from the user
// authenticate it
// if correct the render it to secret
// otherwise send it to login page
// })





app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))