import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { hashPassword } from "../middlewares/hashPassword.middleware.js";

const router = express.Router();

// Apply hashPassword middleware before register
router.post("/register", hashPassword, registerUser);

router.post("/login", loginUser);

export default router;
