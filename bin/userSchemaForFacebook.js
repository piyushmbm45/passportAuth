const mongoose = require('mongoose');
const {
    Schema
} = mongoose;


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
});


const userSchema = new Schema({
    id : String,
    name: String,
    photo : String
})

const UserFacebook = new mongoose.model('UserFacebook', userSchema);


module.exports = UserFacebook;