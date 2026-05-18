const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the patient's full name"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Please provide the patient's age"],
      min: [0, "Age cannot be negative"],
    },
    reason: {
      type: String,
      required: [true, "Please provide the reason for consultation"],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Waiting', 'Triaged', 'With Doctor'],
      default: 'Waiting',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Queue', queueSchema);
