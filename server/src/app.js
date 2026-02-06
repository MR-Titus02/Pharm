import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicine.routes.js";

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

export default app;