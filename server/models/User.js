const mongoose = require('mongoose');
const passport = require('passport');

const userSchema = new mongoose.Schema({
  googleId: { type: String},
  email: { type: String, required: true },
  name: { type: String },
  username: { type: String },
  picture: { type: String },
  bio:{type: String},
 password: { type: String },
  
  
});

module.exports = mongoose.model('User', userSchema);
