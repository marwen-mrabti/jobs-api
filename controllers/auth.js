const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const { CustomAPIError, BadRequestError } = require("../errors");

/**
 * @description Register a user
 * @route POST /api/v1/auth/register
 * @access Public
 * @param {*} req
 * @param {*} res
 */
const register = async (req, res) => {
  //step 1: get user input
  const { name, email, password } = req.body;

  //step 2: validate user input :
  //PS: we are not checking if user exist or not, because the mongoose will do it for us

  //step 3: create new user
  //PS: we are not using the password directly, we are using bcrypt to hash the password _-_ check the User model
  const newUser = await User.create({
    name,
    email,
    password,
  });

  //step 4: create token
  const token = await newUser.createToken();
  //step 5: send token to client
  res.status(StatusCodes.CREATED).json({ token: token });
};

/**
 * @description Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res) => {
  try {
    //step 1: get user input
    const { email, password } = req.body;

    //step 2: validate user input
    if (!email || !password) throw new BadRequestError("All input is required");

    //step 3: check if user exist
    const user = await User.findOne({ email }).exec();
    if (!user) throw new UnauthenticatedError("Invalid email");

    //step 4: check if password is valid
    const isPasswordValid = user.comparePassword(password);
    if (!isPasswordValid) throw new BadRequestError("Invalid credentials");

    //step 5: create token
    const token = await user.createToken();
    //step 6: send token to client
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (error) {
    throw new CustomAPIError(error.message, 500);
  }
};

module.exports = {
  register,
  login,
};
