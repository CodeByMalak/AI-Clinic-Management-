const express = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All appointment routes require authentication

router
  .route('/')
  .post(createAppointment)
  .get(getAppointments);

router
  .route('/:id/status')
  .put(updateAppointmentStatus);

router
  .route('/:id')
  .delete(cancelAppointment);

module.exports = router;
