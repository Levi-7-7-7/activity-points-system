const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true, // ✅ Email must be unique
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    default: 'student'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  registerNumber: {
    type: String, // ✅ No unique, no required
    default: null
  },
  rollNumber: {
    type: String, // ✅ No unique, no required
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
