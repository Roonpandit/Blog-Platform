const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/:userId/posts', postController.getUserPosts);

module.exports = router;