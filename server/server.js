import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Route Imports (UniFix Specific) ---
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import uploadRoutes from './routes/upload.js';
import departmentRoutes from './routes/departments.js'; // Points to the renamed departments logic
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();

// --- ESM __dirname Support ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files so the frontend can display them
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- UniFix API Routing ---
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/departments', departmentRoutes); 
app.use('/api/leaderboard', leaderboardRoutes);

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI) // Uses the variable name from your .env
  .then(() => console.log('🚀 UniFix Database Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 UniFix Server active on http://localhost:${PORT}`);
});