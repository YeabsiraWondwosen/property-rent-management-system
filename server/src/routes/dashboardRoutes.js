import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin", "owner"),
  getDashboardStats
);

export default router;