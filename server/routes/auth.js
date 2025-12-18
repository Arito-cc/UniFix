import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// @route    POST api/auth/register
// @desc     Register a Student or Staff member
// @access   Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['Student', 'Staff']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password, role, locality, department } = req.body;

    try {
      // 1. Check if user already exists
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({ msg: 'User with this email or username already exists' });
      }

      // 2. Validation for Staff
      if (role === 'Staff' && !department) {
        return res.status(400).json({ msg: 'Department assignment is required for staff accounts' });
      }

      // 3. Create User Instance
      const newUserData = {
        name,
        username,
        email,
        password,
        role,
        locality: locality || undefined,
        department: role === 'Staff' ? department : undefined
      };

      user = new User(newUserData);

      // 4. Hash Password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // 5. Generate UniFix Token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
          department: user.department || null, // Matches the frontend AuthContext
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ token });
        }
      );
    } catch (err) {
      console.error('Registration Error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token (Supports Email or Username)
// @access   Public
router.post(
  '/login',
  [
    check('emailOrUsername', 'Identifier is required').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    try {
      // Find user by email OR username
      let user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role,
          department: user.department || null,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Login Error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;