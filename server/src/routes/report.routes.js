import express from "express";
import { getDashboardStats } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Protected Admin routes
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats);

export default router;
