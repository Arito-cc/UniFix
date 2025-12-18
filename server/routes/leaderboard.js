import express from 'express';
import Department from '../models/Department.js'; // Updated reference

const router = express.Router();

/**
 * @route   GET /api/leaderboard
 * @desc    Get all campus departments, sorted by average student rating
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // 1. Fetch all departments from the database
    // 2. Sort by 'averageRating' descending (-1) to put the best performers at the top
    const leaderboard = await Department.find()
      .sort({ averageRating: -1 });

    res.json(leaderboard);
  } catch (err) {
    console.error('UniFix Leaderboard Error:', err);
    res.status(500).send('Server Error');
  }
});

export default router;