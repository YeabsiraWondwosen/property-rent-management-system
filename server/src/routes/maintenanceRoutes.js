import express from "express";

import {
  createMaintenance,
  getMaintenanceRequests,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenanceController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import validate from "../middleware/validationMiddleware.js";

import {
  maintenanceValidator,
} from "../validators/maintenanceValidator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "owner", "tenant"),
  maintenanceValidator,
  validate,
  createMaintenance
);

router.get(
  "/",
  protect,
  authorize("admin", "owner", "tenant"),
  getMaintenanceRequests
);

router.get(
  "/:id",
  protect,
  authorize("admin", "owner", "tenant"),
  getMaintenanceById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "owner"),
  updateMaintenance
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "owner"),
  deleteMaintenance
);

export default router;