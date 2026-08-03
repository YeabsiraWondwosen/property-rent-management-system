import express from "express";

import {
  createLease,
  getLeases,
  getLeaseById,
  updateLease,
  deleteLease,
} from "../controllers/leaseController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import validate from "../middleware/validationMiddleware.js";

import {
  leaseValidator,
} from "../validators/leaseValidator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "owner"),
  leaseValidator,
  validate,
  createLease
);

router.get(
  "/",
  protect,
  authorize("admin", "owner", "tenant"),
  getLeases
);

router.get(
  "/:id",
  protect,
  authorize("admin", "owner", "tenant"),
  getLeaseById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "owner"),
  updateLease
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "owner"),
  deleteLease
);

export default router;