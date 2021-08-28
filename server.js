require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const passport = require('passport-local');
const PORT = process.env.PORT || 3000;

const app = express();
// middle for express url and body parser
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// mongodb connection
const uri = process.env.DB_URL
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log("Database Connected Successfully");
    }
})


app.get('/home', (req, res) => {
    res.send("hello world")
})










app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))