import { body } from "express-validator";

export const maintenanceValidator = [
  body("property")
    .trim()
    .notEmpty()
    .withMessage("Property is required.")
    .isMongoId()
    .withMessage("Property ID is invalid."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Maintenance title is required.")
    .isLength({ min: 3 })
    .withMessage(
      "Maintenance title must be at least 3 characters."
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Maintenance description is required.")
    .isLength({ min: 5 })
    .withMessage(
      "Maintenance description must be at least 5 characters."
    ),

  body("priority")
    .optional()
    .isIn([
      "Low",
      "Medium",
      "High",
    ])
    .withMessage("Invalid maintenance priority."),
];