require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();



// Routes
app.use('/', require('./routes/home'))
app.use('/', require('./routes/passportLocal'))

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))