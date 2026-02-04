import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/auth.routes.js";
import { protect } from "../src/middlewares/auth.middleware.js";
import { authorizeRoles } from "../src/middlewares/role.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;