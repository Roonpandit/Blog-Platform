const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog-platform'
    });

    req.body.image = result.secure_url;
    req.body.cloudinaryId = result.public_id;

    fs.unlinkSync(req.file.path);
    
    next();
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

exports.deleteImage = async (cloudinaryId) => {
  try {
    if (cloudinaryId) {
      await cloudinary.uploader.destroy(cloudinaryId);
    }
    return true;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};