import express from "express";
import { createProperty } from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Property
router.post("/", protect, createProperty);

export default router;