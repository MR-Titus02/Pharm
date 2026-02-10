import express from "express";
import {
  createRequest,
  getUserRequests,
} from "../controllers/request.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

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

export default router;