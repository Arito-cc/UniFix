import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// --- ESM Path Resolution ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Ensure the 'uploads' directory exists in the server root
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Multer Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    // Generates a unique filename using timestamp + extension
    // e.g., 1734567890123.jpg
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

// 3. Define File Filter (Security Check)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// @route   POST /api/upload
// @desc    Handles image uploads for "Before" and "After" photos
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  /**
   * Returns the relative path for the database.
   * On the frontend, this will be prefixed with the server URL.
   */
  res.status(200).json({
    msg: 'Image synced successfully.',
    filePath: `/uploads/${req.file.filename}`,
  });
});

export default router;