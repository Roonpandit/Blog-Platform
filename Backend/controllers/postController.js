// controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const { deleteImage } = require('../middleware/imageUpload');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    const post = new Post({
      title,
      content,
      tags: tagsArray,
      author: req.user._id,
      image: req.body.image || '',
      cloudinaryId: req.body.cloudinaryId || ''
    });

    const savedPost = await post.save();
    
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all posts (with pagination and filtering options)
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        select: 'content createdAt',
        populate: {
          path: 'author',
          select: 'username'
        }
      });

    const totalPosts = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username'
        }
      })
      .populate('likes', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;

    // Handle image update if a new image is uploaded
    if (req.body.image && post.cloudinaryId) {
      await deleteImage(post.cloudinaryId);
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tagsArray;
    post.image = req.body.image || post.image;
    post.cloudinaryId = req.body.cloudinaryId || post.cloudinaryId;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author of the post or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image from cloudinary if exists
    if (post.cloudinaryId) {
      await deleteImage(post.cloudinaryId);
    }

    // Changed from post.remove() to deleteOne()
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked the post
    if (post.likes.includes(req.user._id)) {
      // Unlike the post
      post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      // Like the post
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

// Add post to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already in favorites
    if (user.favoritePosts.includes(req.params.id)) {
      // Remove from favorites
      user.favoritePosts = user.favoritePosts.filter(
        postId => postId.toString() !== req.params.id
      );
    } else {
      // Add to favorites
      user.favoritePosts.push(req.params.id);
    }

    await user.save();

    res.json({ favoritePosts: user.favoritePosts });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorites', error: error.message });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'username');

    const totalPosts = await Post.countDocuments({ author: req.params.userId });

    res.json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error: error.message });
  }
};

// Get user's favorite posts
exports.getFavoritePosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favoritePosts',
      populate: {
        path: 'author',
        select: 'username'
      }
    });

    res.json({ favoritePosts: user.favoritePosts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite posts', error: error.message });
  }
};