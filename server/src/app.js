import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Property Rent Management API",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

export default app;