// controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId
    });

    const savedComment = await comment.save();

    // Add comment to post
    post.comments.push(savedComment._id);
    await post.save();

    // Populate author details
    await savedComment.populate('author', 'username');

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author of the comment or an admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from post
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments = post.comments.filter(
        commentId => commentId.toString() !== req.params.commentId
      );
      await post.save();
    }

    // Changed from comment.remove() to deleteOne()
    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// Like a comment
exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked the comment
    if (comment.likes.includes(req.user._id)) {
      // Unlike the comment
      comment.likes = comment.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // Like the comment
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking comment', error: error.message });
  }
};