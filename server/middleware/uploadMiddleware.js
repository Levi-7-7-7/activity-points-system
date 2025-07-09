const multer = require('multer');
const imagekit = require('../utils/imagekit');

// Use memory storage to access the file buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg, .jpeg, .png, .pdf formats allowed'), false);
    }
  },
});

const uploadMiddleware = upload.single('file');

// ImageKit uploader middleware
const imageKitUploader = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file provided' });
  }

  try {
    const uploaded = await imagekit.upload({
      file: req.file.buffer.toString('base64'), // Convert buffer to base64
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: 'certificates',
    });

    // Inject ImageKit URL into request so it can be saved in DB
    req.file.path = uploaded.url;
    next();
  } catch (err) {
    console.error('❌ ImageKit Upload Error:', err.message);
    res.status(500).json({ msg: 'File upload failed', error: err.message });
  }
};

module.exports = [uploadMiddleware, imageKitUploader];
