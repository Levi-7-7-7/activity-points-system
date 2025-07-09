const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  level: { type: String, enum: ['state', 'national', 'international'] },
  fileUrl: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  points: { type: Number, default: 0 },
  tutorComment: String
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
