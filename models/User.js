const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    trim: true,
    minlength: [3, "Minimum name length is 3 characters"],
    max: [20, "Maximum name length is 20 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exist"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
    toLowerCase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
});

/**
 * @description Hash user password before saving
 * @param {Function} next
 * @returns {void}
 */
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
 * @method creteToken
 * @description Create a token for the user
 * @returns {String} token
 * @returns {void}
 */
userSchema.methods.createToken = async function () {
  const token = await jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

/*
 * @method comparePassword
 * @description Compare user password
 * @param {String} enteredPassword
 * @returns {Boolean} isPasswordValid
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  const isPasswordValid = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordValid;
};

module.exports = mongoose.model("user", userSchema);
