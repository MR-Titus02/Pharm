import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import requestRoutes from "./routes/request.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import reportRoutes from "./routes/report.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import path from "path";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/upload", uploadRoutes);

app.use("/api/requests", requestRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);


// error handler LAST
app.use(errorHandler);


export default app;