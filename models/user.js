const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  pic: {
    type: String,
    required: false
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

module.exports = mongoose.model('User', userSchema);