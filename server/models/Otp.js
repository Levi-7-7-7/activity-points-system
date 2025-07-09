const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL 5 mins
  userData: {
    name: String,
    email: String,
    password: String,
    role: String,
    registerNumber: String,
    rollNumber: String
  }
});

module.exports = mongoose.model('Otp', otpSchema);
