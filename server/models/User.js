const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
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
    type: String,
    required: function () {
      return this.role === 'student';
    }
  },
  rollNumber: {
    type: String,
    required: function () {
      return this.role === 'student';
    }
  }
}, {
  timestamps: true // Optional: Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
