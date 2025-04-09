const User = require('../models/User');
const Post = require('../models/Post');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    const usersWithPostCounts = await Promise.all(
      users.map(async (user) => {
        const postCount = await Post.countDocuments({ author: user._id });
        return {
          ...user._doc,
          postCount
        };
      })
    );

    res.json(usersWithPostCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isBanned: user.isBanned
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};