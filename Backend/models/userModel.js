const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Please enter your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"]
  },

  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },

  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    // select: false
  },

  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },

  role: {
    type: String,
    default: "user"
  },

  Otp: {
    type: Number,
    default: 0
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date
})


// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;