const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/users', protect, admin, adminController.getAllUsers);
router.put('/users/:userId/toggle-ban', protect, admin, adminController.toggleUserBan);

module.exports = router;