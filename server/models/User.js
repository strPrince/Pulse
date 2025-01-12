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
 followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  
  
});

module.exports = mongoose.model('User', userSchema);
