import express from 'express';
import { auth, requireManager } from '../middleware/auth';
import Timesheet from '../models/Timesheet';

const router = express.Router();

// Create a new timesheet
router.post('/', auth, async (req, res) => {
  try {
    const { weekStart } = req.body;
    const timesheet = new Timesheet({
      user: req.user?._id,
      weekStart: new Date(weekStart),
    });
    await timesheet.save();
    res.status(201).json(timesheet);
  } catch (error) {
    res.status(400).json({ message: 'Error creating timesheet' });
  }
});

// Add entry to timesheet
router.post('/:id/entry', auth, async (req, res) => {
  try {
    const { date, jobName, hours } = req.body;
    const timesheet = await Timesheet.findOne({ _id: req.params.id, user: req.user?._id });

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    timesheet.entries.push({ date: new Date(date), jobName, hours });
    timesheet.totalHours += hours;
    await timesheet.save();

    res.json(timesheet);
  } catch (error) {
    res.status(400).json({ message: 'Error adding entry' });
  }
});

// Get user's timesheets
router.get('/', auth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ user: req.user?._id })
      .sort({ weekStart: -1 })
      .limit(6);
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheets' });
  }
});

// Mark timesheet as completed
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const timesheet = await Timesheet.findOne({ _id: req.params.id, user: req.user?._id });

    if (!timesheet) {
      return res.status(404).json({ message: 'Timesheet not found' });
    }

    timesheet.status = 'completed';
    await timesheet.save();

    res.json(timesheet);
  } catch (error) {
    res.status(400).json({ message: 'Error completing timesheet' });
  }
});

// Get all timesheets (manager only)
router.get('/all', auth, requireManager, async (req, res) => {
  try {
    const timesheets = await Timesheet.find().populate('user', 'email');
    res.json(timesheets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timesheets' });
  }
});

export default router;
