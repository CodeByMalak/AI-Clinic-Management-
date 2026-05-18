const express = require('express');
const {
  getQueues,
  addToQueue,
  updateQueueStatus,
} = require('../controllers/queueController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All queue routes require session authentication
router.use(protect);

router
  .route('/')
  .get(getQueues)
  .post(authorize('Admin', 'Receptionist'), addToQueue);

router
  .route('/:id/status')
  .put(authorize('Admin', 'Receptionist'), updateQueueStatus);

module.exports = router;
