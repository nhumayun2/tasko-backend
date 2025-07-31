import express from "express";
import {
  registerUserController,
  authUserController,
  getUserProfileController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import {
  registerValidationRules,
  loginValidationRules,
  taskValidationRules,
  forgotPasswordValidationRules, // Import new validation
  resetPasswordValidationRules, // Import new validation
  validate,
} from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidationRules(),
  validate,
  registerUserController
);
router.post("/login", loginValidationRules(), validate, authUserController);
router.get("/profile", protect, getUserProfileController);

// Password Reset Routes with Validation
router.post(
  "/forgotpassword",
  forgotPasswordValidationRules(),
  validate,
  forgotPasswordController
);
router.put(
  "/resetpassword/:token",
  resetPasswordValidationRules(),
  validate,
  resetPasswordController
);

export default router;
