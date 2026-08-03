import { body } from "express-validator";

export const paymentValidator = [
  body("lease")
    .trim()
    .notEmpty()
    .withMessage("Lease is required.")
    .isMongoId()
    .withMessage("Lease ID is invalid."),

  body("amount")
    .notEmpty()
    .withMessage("Payment amount is required.")
    .isFloat({ min: 0.01 })
    .withMessage(
      "Payment amount must be greater than zero."
    ),

  body("paymentMethod")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required."),

  body("paymentDate")
    .optional()
    .isISO8601()
    .withMessage("Payment date must be a valid date."),

  body("status")
    .optional()
    .isIn([
      "Pending",
      "Completed",
      "Failed",
    ])
    .withMessage("Invalid payment status."),

  body("note")
    .optional()
    .trim(),
];