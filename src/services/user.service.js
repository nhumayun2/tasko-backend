import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto"; // Import crypto for token hashing

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const registerUser = async (username, email, password) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    // console.log('User registered. Hashed password stored:', user.password); // REMOVE THIS DEBUG LOG
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid user data");
  }
};

const authUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid email or password");
  }
};

// Request password reset
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found"); // Or a more generic message for security
  }

  // Get reset token from user model method
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // Save user with new token and expiry

  // In a real application, you would send an email here.
  // For this project, we'll return the token directly for testing.
  // const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  // await sendEmail({
  //   email: user.email,
  //   subject: 'Password Reset Token',
  //   message: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`
  // });

  return {
    message:
      "Password reset token generated (check console/response for token)",
    resetToken,
  };
};

// Reset password
const resetPassword = async (token, newPassword) => {
  // Hash the incoming token to compare with the stored hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Check if token is not expired
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined; // Clear token
  user.resetPasswordExpire = undefined; // Clear expiry

  await user.save(); // Save the user with the new hashed password

  return { message: "Password reset successful" };
};

// New function to fetch a user's friends list
const getFriendsList = async (userId) => {
  const user = await User.findById(userId).populate(
    "friends",
    "username email"
  );
  if (!user) {
    throw new Error("User not found");
  }
  return user.friends;
};

export {
  registerUser,
  authUser,
  requestPasswordReset,
  resetPassword,
  getFriendsList,
};
