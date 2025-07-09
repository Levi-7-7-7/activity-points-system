const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // ImageKit middleware (multer + upload)
const User = require('../models/User');

// 📤 Upload certificate (Student)
router.post('/upload', auth, upload, async (req, res) => {
  try {
    const { title, level } = req.body;

    if (!title || !level) {
      return res.status(400).json({ msg: 'Title and level are required' });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({ msg: 'File upload failed or no file attached' });
    }

    const fileUrl = req.file.path;

    const cert = new Certificate({
      student: req.user.userId,
      title,
      level,
      fileUrl,
    });

    await cert.save();

    res.status(201).json({
      msg: 'Certificate uploaded successfully',
      certificate: cert,
    });

  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ msg: 'Upload failed', error: err.message });
  }
});

// ✅ Approve or Reject Certificate (Tutor)
router.put('/review/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ msg: 'Only tutors can approve/reject' });
    }

    const { action, comment } = req.body;
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    if (certificate.status !== 'pending') {
      return res.status(400).json({ msg: 'Already reviewed' });
    }

    let points = 0;
    if (action === 'approve') {
      if (certificate.level === 'state') points = 10;
      else if (certificate.level === 'national') points = 20;
      else if (certificate.level === 'international') points = 30;

      certificate.status = 'approved';
      certificate.points = points;
    } else if (action === 'reject') {
      certificate.status = 'rejected';
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }

    certificate.tutorComment = comment;
    await certificate.save();

    if (action === 'approve') {
      await User.findByIdAndUpdate(certificate.student, {
        $inc: { totalPoints: points },
      });
    }

    res.json({ msg: `Certificate ${action}d`, certificate });

  } catch (err) {
    console.error('❌ Review error:', err);
    res.status(500).json({ msg: 'Error updating certificate', error: err.message });
  }
});

// 📥 Get all certificates of logged-in student
router.get('/my-certificates', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ msg: 'Only students can view their certificates' });
    }

    const certificates = await Certificate.find({ student: req.user.userId }).sort({ createdAt: -1 });
    res.json(certificates);

  } catch (err) {
    console.error('❌ Fetch my-certificates error:', err);
    res.status(500).json({ msg: 'Failed to fetch certificates', error: err.message });
  }
});

// 📋 Get all pending certificates (Tutor)
router.get('/pending', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ msg: 'Only tutors can access this' });
    }

    const pendingCerts = await Certificate.find({ status: 'pending' })
      .populate('student', 'name email totalPoints');

    res.json(pendingCerts);

  } catch (err) {
    console.error('❌ Fetch pending certificates error:', err);
    res.status(500).json({ msg: 'Error fetching pending certificates', error: err.message });
  }
});

// 🗑️ Delete a certificate (Student Only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);

    if (!cert) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }

    if (cert.student.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    if (cert.status !== 'pending') {
      return res.status(400).json({ msg: 'Cannot delete after review' });
    }

    await cert.deleteOne();

    res.json({ msg: 'Certificate deleted successfully' });

  } catch (err) {
    console.error('❌ Delete certificate error:', err);
    res.status(500).json({ msg: 'Deletion failed', error: err.message });
  }
});

// 📄 Get all certificates of a student (Tutor use)
router.get('/student/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ msg: 'Only tutors can access this' });
    }

    const certs = await Certificate.find({ student: req.params.id })
      .populate('student', 'name email');

    res.json(certs);

  } catch (err) {
    console.error('❌ Get student certificates error:', err);
    res.status(500).json({ msg: 'Failed to fetch student certificates', error: err.message });
  }
});

// 🔔 Latest 10 Pending Certificates (Tutor notifications)
router.get('/notifications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ msg: 'Only tutors can access this' });
    }

    const recent = await Certificate.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('student', 'name email');

    res.json(recent);

  } catch (err) {
    console.error('❌ Notification fetch error:', err);
    res.status(500).json({ msg: 'Error fetching notifications', error: err.message });
  }
});

module.exports = router;
