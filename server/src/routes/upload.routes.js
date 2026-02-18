import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/prescription",
  protect,
  upload.single("prescription"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Prescription file is required",
      });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  }
);

router.post(
  "/image",
  protect,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      file: req.file,
    });
  }
);


export default router;
