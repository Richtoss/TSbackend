import express from 'express';
import { auth, requireManager } from '../middleware/auth';
import Job from '../models/Job';

const router = express.Router();

// Create a new job (manager only)
router.post('/', auth, requireManager, async (req, res) => {
  try {
    const { name } = req.body;
    const job = new Job({ name });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job' });
  }
});

// Get all jobs
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

export default router;
