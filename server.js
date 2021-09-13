require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();



// Routes
app.use('/', require('./routes/homeRoute'))
app.use('/', require('./routes/googleRoute'))
// app.use('/',require('./routes/passportFacebook'))

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))