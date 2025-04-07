const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

// Upload single image route
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router; 