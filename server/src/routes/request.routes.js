import express from "express";
import {
  createRequest,
  getUserRequests,
} from "../controllers/request.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getAllRequests,
  updateRequestStatus,
} from "../controllers/adminRequest.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Create request (with optional prescription upload)
router.post(
  "/",
  protect,
  upload.single("prescription"),
  createRequest
);

// Get logged-in user's requests
router.get("/user", protect, getUserRequests);

// ADMIN routes
router.get("/", protect, authorizeRoles("admin"), getAllRequests);
router.put("/:id", protect, authorizeRoles("admin"), updateRequestStatus);

export default router;