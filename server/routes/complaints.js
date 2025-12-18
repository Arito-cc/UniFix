import express from 'express';
import { check, validationResult } from 'express-validator';
import auth from '../middleware/authMiddleware.js';
import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';

const router = express.Router();

/**
 * Helper: Recalculates the average rating for a department whenever 
 * a student submits a new rating for a resolved complaint.
 */
const recalculateAverageRating = async (deptId) => {
  if (!deptId) return;
  try {
    const complaints = await Complaint.find({
      resolvedByDepartment: deptId,
      rating: { $ne: null },
    });

    let average = 0;
    if (complaints.length > 0) {
      const sum = complaints.reduce((acc, c) => acc + (c.rating || 0), 0);
      average = sum / complaints.length;
    }

    await Department.findByIdAndUpdate(deptId, {
      averageRating: Number(average.toFixed(1)),
    });
  } catch (err) {
    console.error(`Error updating dept rating:`, err);
  }
};

// @route   POST api/complaints
// @desc    Submit a new campus issue (Students only)
router.post(
  '/',
  [auth, [check('title', 'Title is required').not().isEmpty(), check('description', 'Description is required').not().isEmpty()]],
  async (req, res) => {
    if (req.user.role !== 'Student') {
      return res.status(403).json({ msg: 'Only students can submit complaints.' });
    }

    const { title, description, location, beforeImage } = req.body;
    try {
      const newComplaint = new Complaint({
        title,
        description,
        location, // Structured: { building, roomNumber, area }
        beforeImage: beforeImage || 'https://placehold.co/600x400?text=No+Image',
        submittedBy: req.user.id,
      });

      const complaint = await newComplaint.save();
      res.status(201).json(complaint);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/complaints
// @desc    Get complaints for the logged-in user (Student: Theirs | Staff: Departmental)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Student') {
      query = { submittedBy: req.user.id };
    } else if (req.user.role === 'Staff') {
      // Staff see complaints that are either new or assigned to their department
      query = { $or: [{ status: 'Submitted' }, { resolvedByDepartment: req.user.department }] };
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name username')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/complaints/public
// @desc    Public Feed for the Home Page (Sorted by Upvote Popularity)
router.get('/public', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name username')
      .sort({ createdAt: -1 });
    
    // Sort by virtual upvoteCount
    const sorted = complaints.sort((a, b) => b.upvoteCount - a.upvoteCount);
    res.json(sorted);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/complaints/:id/upvote
// @desc    Toggle upvote on a complaint
router.patch('/:id/upvote', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });

    // Check if user already upvoted
    const upvoteIndex = complaint.upvotedBy.indexOf(req.user.id);

    if (upvoteIndex > -1) {
      complaint.upvotedBy.splice(upvoteIndex, 1); // Remove upvote
    } else {
      complaint.upvotedBy.push(req.user.id); // Add upvote
    }

    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/complaints/:id
// @desc    Update Status & Progress Photo (Staff only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'Staff') {
    return res.status(403).json({ msg: 'Access denied. Staff only.' });
  }

  const { status, afterImage } = req.body;
  const updateFields = {};
  if (status) updateFields.status = status;
  if (afterImage) updateFields.afterImage = afterImage;

  if (status === 'Resolved') {
    updateFields.resolvedByDepartment = req.user.department;
  }

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { $set: updateFields }, 
      { new: true }
    ).populate('submittedBy', 'name');
    
    res.json(complaint);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/complaints/:id/rate
// @desc    Submit rating for a resolved complaint (Students only)
router.patch('/:id/rate', auth, async (req, res) => {
  const { rating } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint || complaint.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized to rate this report.' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ msg: 'Issue must be resolved before rating.' });
    }

    complaint.rating = rating;
    await complaint.save(); // IMPORTANT: This must match the field name in your Complaint model

    // Trigger department leaderboard update
    if (complaint.resolvedByDepartment) {
      await recalculateAverageRating(complaint.resolvedByDepartment);
    }
    
    res.json(complaint);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;