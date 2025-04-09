const Post = require('../models/Post');
const User = require('../models/User');
const { deleteImage } = require('../middleware/imageUpload');

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

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;

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

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    if (post.cloudinaryId) {
      await deleteImage(post.cloudinaryId);
    }

    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (user.favoritePosts.includes(req.params.id)) {
     user.favoritePosts = user.favoritePosts.filter(
        postId => postId.toString() !== req.params.id
      );
    } else {
      user.favoritePosts.push(req.params.id);
    }

    await user.save();

    res.json({ favoritePosts: user.favoritePosts });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorites', error: error.message });
  }
};

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