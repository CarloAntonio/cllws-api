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
  onBoarded: {
    type: Boolean,
    require: true,
    default: false
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

userSchema.methods.getPublicFields = function(){
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    pic: this.pic,
  }
}

userSchema.methods.getPrivateFields = function(){
  return {
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    pic: this.pic,
    onBoarded: this.onBoarded
  }
}

module.exports = mongoose.model('User', userSchema);