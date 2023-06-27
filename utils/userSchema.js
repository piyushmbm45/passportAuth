const mongoose = require('mongoose');
const { Schema } = mongoose;

const uri = process.env.DB_URL;
mongoose.set('strictQuery', true);
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log('Database Connected Successfully');
    } else {
      console.log(err);
    }
  }
);

const userSchema = new Schema(
  {
    name: String,
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: String,
    last_login: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model('User', userSchema);

module.exports = User;
