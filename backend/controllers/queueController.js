const Queue = require('../models/queueModel');

// @desc    Get all active queue items
// @route   GET /api/queues
// @access  Private
const getQueues = async (req, res) => {
  try {
    const queues = await Queue.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient queue',
      error: error.message,
    });
  }
};

// @desc    Add patient to queue
// @route   POST /api/queues
// @access  Private (Admin, Receptionist)
const addToQueue = async (req, res) => {
  try {
    const { name, age, reason } = req.body;

    if (!name || !age || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient name, age, and reason for consultation',
      });
    }

    const queueItem = await Queue.create({ name, age, reason });

    res.status(201).json({
      success: true,
      data: queueItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add patient to queue',
      error: error.message,
    });
  }
};

// @desc    Update triage status or discharge patient
// @route   PUT /api/queues/:id/status
// @access  Private (Admin, Receptionist)
const updateQueueStatus = async (req, res) => {
  try {
    let queueItem = await Queue.findById(req.params.id);

    if (!queueItem) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found in active queue',
      });
    }

    const currentStatus = queueItem.status;
    let nextStatus;

    if (currentStatus === 'Waiting') {
      nextStatus = 'Triaged';
    } else if (currentStatus === 'Triaged') {
      nextStatus = 'With Doctor';
    } else {
      // If already 'With Doctor', discharging removes the patient node from the active queue DB
      await queueItem.deleteOne();
      return res.status(200).json({
        success: true,
        discharged: true,
        message: 'Patient successfully discharged and removed from active queue',
      });
    }

    queueItem.status = nextStatus;
    await queueItem.save();

    res.status(200).json({
      success: true,
      data: queueItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update patient status',
      error: error.message,
    });
  }
};

module.exports = {
  getQueues,
  addToQueue,
  updateQueueStatus,
};
