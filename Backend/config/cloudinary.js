const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dwadl5wii',
  api_key: process.env.CLOUDINARY_API_KEY || '651972679213474',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'wz-ubgiZpHY9vhaUn0G4Aq4jeCQ'
});

module.exports = cloudinary;