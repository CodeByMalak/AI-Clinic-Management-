const Appointment = require('../models/appointmentModel');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, reason, notes } = req.body;

    // Check for existing appointment
    const existing = await Appointment.findOne({ doctor, date, timeSlot, status: { $ne: 'Cancelled' } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Time slot already booked for this doctor' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      timeSlot,
      reason,
      notes
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments (filter by date, status, doctor, patient)
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { date, status, doctor } = req.query;
    let query = {};

    if (req.user.role === 'Patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'Doctor') {
      query.doctor = req.user._id;
    }

    if (date) query.date = date;
    if (status) query.status = status;
    if (doctor && req.user.role !== 'Doctor') query.doctor = doctor;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role check
    if (req.user.role === 'Patient' && status !== 'Cancelled') {
      return res.status(403).json({ success: false, message: 'Patients can only cancel appointments' });
    }

    if (req.user.role === 'Patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment' });
    }

    if (req.user.role === 'Doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (req.user.role === 'Patient' && appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
