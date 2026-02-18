import express from "express";
import {
  getDashboardStats,
  getUserStats,
  getAdminReports,
} from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Protected Admin routes
router.get("/dashboard", protect, authorizeRoles("admin"), getDashboardStats);
router.get("/admin", protect, authorizeRoles("admin"), getAdminReports);

// Protected User routes
router.get("/user-stats", protect, getUserStats);

export default router;
