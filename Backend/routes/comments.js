const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect, allowedToPost } = require('../middleware/auth');

// Protected routes
router.post('/:postId', protect, allowedToPost, commentController.createComment);
router.delete('/:commentId', protect, commentController.deleteComment);
router.post('/:commentId/like', protect, commentController.likeComment);

module.exports = router;