const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Public routes
router.get('/:userId/posts', postController.getUserPosts);

module.exports = router;