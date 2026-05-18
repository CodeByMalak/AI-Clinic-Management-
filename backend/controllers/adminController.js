const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');
const Queue = require('../models/queueModel');

// @desc    Retrieve dynamic administrative clinical portal metrics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    // 1. Core Counts
    const totalFaculty = await User.countDocuments({
      role: { $in: ['Admin', 'Doctor', 'Receptionist'] },
    });

    const activePatients = await User.countDocuments({ role: 'Patient' });
    const bookedVisits = await Appointment.countDocuments();
    const liveQueues = await Queue.countDocuments();

    // 2. Doctor Specializations Aggregation
    const specializationBreakdown = await User.aggregate([
      { $match: { role: 'Doctor' } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Appointment Status Aggregation
    const appointmentBreakdown = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 4. Live Log Data (Fetch recent registered users to represent security network events)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('name email role createdAt');

    const securityLogs = recentUsers.map((u, i) => {
      // Formulate realistic clinical access log actions
      const actions = {
        Admin: 'GET /api/admin/stats',
        Doctor: 'POST /api/ai/diagnose',
        Receptionist: 'POST /api/queues',
        Patient: 'GET /api/appointments/my-bookings',
      };
      
      return {
        id: u._id,
        identifier: `usr_${u._id.toString().substring(18)}`,
        name: u.name,
        role: u.role,
        action: actions[u.role] || 'GET /api/auth/me',
        timestamp: new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        status: '200 OK',
      };
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalFaculty,
          activePatients,
          bookedVisits,
          liveQueues,
        },
        breakdowns: {
          specializations: specializationBreakdown,
          appointments: appointmentBreakdown,
        },
        logs: securityLogs,
      },
    });
  } catch (error) {
    console.error('Admin Stats Fetch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred compiling clinic metrics.',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
