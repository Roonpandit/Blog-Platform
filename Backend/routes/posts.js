const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, allowedToPost } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadImage } = require('../middleware/imageUpload');

// Public routes
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);
router.get('/user/:userId', postController.getUserPosts);

// Protected routes
router.post('/', protect, allowedToPost, upload.single('image'), uploadImage, postController.createPost);
router.put('/:id', protect, allowedToPost, upload.single('image'), uploadImage, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);
router.post('/:id/like', protect, postController.likePost);
router.post('/:id/favorite', protect, postController.addToFavorites);
router.get('/favorites/list', protect, postController.getFavoritePosts);

module.exports = router;