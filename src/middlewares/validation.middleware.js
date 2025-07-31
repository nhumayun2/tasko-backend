import { body, validationResult } from "express-validator";

// Validation rules for user registration
const registerValidationRules = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

// Validation rules for user login
const loginValidationRules = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};

// Validation rules for task creation/update
const taskValidationRules = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Task title is required")
      .isLength({ min: 3 })
      .withMessage("Task title must be at least 3 characters long"),
    body("description").trim().optional({ checkFalsy: true }),
    body("status")
      .optional({ checkFalsy: true })
      .isIn(["To Do", "In Progress", "Done", "Pending", "Ongoing"])
      .withMessage("Invalid task status"),
    body("priority")
      .optional({ checkFalsy: true })
      .isIn(["Low", "Medium", "High"])
      .withMessage("Invalid task priority"),
    body("category") // Updated validation for category to use isIn
      .optional({ checkFalsy: true })
      .isIn([
        "General",
        "Arts and Craft",
        "Nature",
        "Family",
        "Sport",
        "Friends",
        "Meditation",
        "Collaborative Task",
      ])
      .withMessage("Invalid task category"),
    body("points")
      .optional({ checkFalsy: true })
      .isInt({ min: 0 })
      .withMessage("Points must be a non-negative integer"),
    body("dueDate")
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage("Invalid due date format (YYYY-MM-DD)"),
  ];
};

// Validation rules for forgot password request
const forgotPasswordValidationRules = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
  ];
};

// Validation rules for reset password
const resetPasswordValidationRules = () => {
  return [
    body("password")
      .trim()
      .notEmpty()
      .withMessage("New password is required")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ];
};

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

export {
  registerValidationRules,
  loginValidationRules,
  taskValidationRules,
  forgotPasswordValidationRules,
  resetPasswordValidationRules,
  validate,
};
