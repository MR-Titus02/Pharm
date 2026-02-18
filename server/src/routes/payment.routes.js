import express from "express";
import { processPayment, getAllPayments } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/process", protect, processPayment);
router.get("/", protect, authorizeRoles("admin"), getAllPayments);

export default router;
