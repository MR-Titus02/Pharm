import express from "express";
import {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getMedicines);
router.get("/:id", getMedicineById);

// Admin routes
router.post("/", protect, authorizeRoles("admin"), createMedicine);
router.put("/:id", protect, authorizeRoles("admin"), updateMedicine);
router.delete("/:id", protect, authorizeRoles("admin"), deleteMedicine);

export default router;