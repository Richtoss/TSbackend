import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth';
import timesheetRoutes from './routes/timesheet';
import jobRoutes from './routes/job';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Suppress deprecation warning
mongoose.set('strictQuery', false);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/timesheet', timesheetRoutes);
app.use('/api/job', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;