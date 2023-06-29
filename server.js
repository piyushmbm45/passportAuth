require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

// middleware to use ejs template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// Routes
app.use('/', require('./config/sessions'));
app.use('/', require('./routes/homeRoute'));
// app.use('/', require('./routes/googleRoute'));
// app.use('/', require('./routes/facebookRoute'));
// app.use('/', require('./routes/twitterRoute'));

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
