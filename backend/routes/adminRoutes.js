const express = require('express');
const { getAdminStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce JWT session protection
router.use(protect);

// Only Faculty Admins can fetch administrative operational metrics
router.get('/stats', authorize('Admin'), getAdminStats);

module.exports = router;
