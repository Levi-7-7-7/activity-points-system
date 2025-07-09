const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const sendOTP = require('../utils/sendOTP');

// === STEP 1: Register and send OTP ===
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, registerNumber, rollNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email }); // remove old OTPs if any

    await Otp.create({
      email,
      otp,
      userData: { name, email, password, role, registerNumber, rollNumber }
    });

    await sendOTP(email, otp);

    res.status(200).json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// === STEP 2: Verify OTP and Create User ===
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ msg: 'User already verified and registered' });
    }

    const { name, password, role, registerNumber, rollNumber } = record.userData;

    if (!name || !password || !role) {
      return res.status(400).json({ msg: 'Incomplete user data in OTP record' });
    }

    if (role === 'student' && (!registerNumber || !rollNumber)) {
      return res.status(400).json({ msg: 'Student must provide register and roll number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'student' && { registerNumber, rollNumber }) // spread only for students
    });

    await user.save();
    await Otp.deleteMany({ email });

    res.status(201).json({ msg: 'User registered successfully. Please login.' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// === LOGIN (Password-based) ===
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Received login request with:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found for email:", email);
      return res.status(400).json({ msg: 'Invalid credentials (email not found)' });
    }

    console.log("👤 Found user:", user.email, "Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (wrong password)' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalPoints: user.totalPoints
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
