const { body, param, query, validationResult } = require("express-validator");

// Helper function to validate results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation rules
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const refreshTokenValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
  validate,
];

// User validation rules
const createUserValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter"),
  validate,
];

const userIdParamValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID(4)
    .withMessage("Invalid User ID format"),
  validate,
];

const userQuestionsValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID(4)
    .withMessage("Invalid User ID format"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validate,
];

// Question validation rules
const createQuestionValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Question content is required")
    .isLength({ min: 3, max: 1000 })
    .withMessage("Question must be between 3 and 1000 characters"),
  validate,
];

const questionIdParamValidation = [
  param("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isUUID(4)
    .withMessage("Invalid Question ID format"),
  validate,
];

module.exports = {
  loginValidation,
  refreshTokenValidation,
  createUserValidation,
  userIdParamValidation,
  userQuestionsValidation,
  createQuestionValidation,
  questionIdParamValidation,
};
