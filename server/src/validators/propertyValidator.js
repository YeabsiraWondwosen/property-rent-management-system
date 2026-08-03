import { body } from "express-validator";

export const propertyValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Property title is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Property description is required."),

  body("price")
    .notEmpty()
    .withMessage("Property price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required."),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Property type is required."),
];