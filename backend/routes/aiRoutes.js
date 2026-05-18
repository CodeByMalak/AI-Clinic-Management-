const express = require('express');
const { performDiagnosis } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Enforce JWT session protection for all AI diagnosis operations
router.use(protect);

// Only Doctors and Admins can perform diagnostic symptom analyses
router.post('/diagnose', authorize('Doctor', 'Admin'), performDiagnosis);

module.exports = router;
