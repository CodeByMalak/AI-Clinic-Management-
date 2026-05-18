const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getDoctors,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.get('/doctors', protect, getDoctors);

module.exports = router;
