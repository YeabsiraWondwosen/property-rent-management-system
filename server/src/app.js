import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import leaseRoutes from "./routes/leaseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());

app.use(express.json());

/**
 * API Health Check
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Property Rent Management API",
  });
});

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/leases", leaseRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/maintenance", maintenanceRoutes);

/**
 * Uploaded Files
 */
app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

/**
 * 404 Handler
 *
 * Must come after all routes.
 */
app.use(notFound);

/**
 * Global Error Handler
 *
 * Must be the last middleware.
 */
app.use(errorHandler);

export default app;