import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} from "../controllers/auth.controller.js";
import { hashPassword } from "../middlewares/hashPassword.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Apply hashPassword middleware before register
router.post("/register", hashPassword, registerUser);

router.post("/login", loginUser);

// Admin routes
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
