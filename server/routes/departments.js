import express from 'express';
import Department from '../models/Department.js'; // This is the fix for the error you saw!

const router = express.Router();

/**
 * @route   POST api/departments
 * @desc    Create a new campus department (e.g., IT, Maintenance)
 * @access  Private (Usually Admin Only)
 */
router.post('/', async (req, res) => {
  try {
    const { name, officeLocation } = req.body;
    
    if (!name || !officeLocation) {
      return res.status(400).json({ msg: 'Please provide a department name and office location.' });
    }

    // Duplicate check: ensure we don't have two "IT Support" departments
    const existing = await Department.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ msg: 'A department with this name already exists.' });
    }

    const department = new Department({ name, officeLocation });
    await department.save();
    
    res.status(201).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

/**
 * @route   GET api/departments
 * @desc    Get all departments (Used for the Registration dropdown)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // We only need name, location, and ID for the frontend selection
    const departments = await Department.find().select('name officeLocation _id');
    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

export default router;