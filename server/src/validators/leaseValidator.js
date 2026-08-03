import { body } from "express-validator";

export const leaseValidator = [
  body("property")
    .trim()
    .notEmpty()
    .withMessage("Property is required.")
    .isMongoId()
    .withMessage("Property ID is invalid."),

  body("tenant")
    .trim()
    .notEmpty()
    .withMessage("Tenant is required.")
    .isMongoId()
    .withMessage("Tenant ID is invalid."),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required.")
    .isISO8601()
    .withMessage("Start date must be a valid date."),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required.")
    .isISO8601()
    .withMessage("End date must be a valid date."),

  body("monthlyRent")
    .notEmpty()
    .withMessage("Monthly rent is required.")
    .isFloat({ min: 0 })
    .withMessage("Monthly rent must be a positive number."),

  body("deposit")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Deposit must be a positive number."),
];