import express from "express";

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import validate from "../middleware/validationMiddleware.js";

import {
  paymentValidator,
} from "../validators/paymentValidator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "owner"),
  paymentValidator,
  validate,
  createPayment
);

router.get(
  "/",
  protect,
  authorize("admin", "owner", "tenant"),
  getPayments
);

router.get(
  "/:id",
  protect,
  authorize("admin", "owner", "tenant"),
  getPaymentById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "owner"),
  updatePayment
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "owner"),
  deletePayment
);

export default router;