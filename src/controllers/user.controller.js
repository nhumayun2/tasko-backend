import {
  registerUser,
  authUser,
  requestPasswordReset,
  resetPassword,
} from "../services/user.service.js";

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUserController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authUser(email, password);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfileController = async (req, res, next) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(404);
    const err = new Error("User not found");
    next(err);
  }
};

// @desc    Request password reset token
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   PUT /api/users/resetpassword/:token
// @access  Public
const resetPasswordController = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  registerUserController,
  authUserController,
  getUserProfileController,
  forgotPasswordController,
  resetPasswordController,
};
