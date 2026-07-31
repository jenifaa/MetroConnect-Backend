import { body, validationResult } from "express-validator";

export const createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .optional()
    .isString()
    .withMessage("Phone must be a string"),

  body("picture")
    .optional()
    .isURL()
    .withMessage("Picture must be a valid URL"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),

  body("role")
    .optional()
    .isIn(["SUPER_ADMIN", "ADMIN", "USER"])
    .withMessage("Invalid role"),

  body("isActive")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "BLOCKED"])
    .withMessage("Invalid account status"),
];



export const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("phone")
    .optional()
    .isString()
    .withMessage("Phone must be a valid string"),

  body("picture")
    .optional()
    .isURL()
    .withMessage("Picture must be a valid URL"),

  body("address")
    .optional()
    .isString()
    .withMessage("Address must be a valid string"),

  body("role")
    .optional()
    .isIn(["SUPER_ADMIN", "ADMIN", "USER", "AGENT"])
    .withMessage("Invalid role"),

  body("isActive")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "BLOCKED"])
    .withMessage("Invalid account status"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be true or false"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};