require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Serve uploaded certificate files =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== API Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/certificates', require('./routes/certificates'));

// ===== Serve React Frontend from client/build =====
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// ✅ Wildcard route (exclude /api)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
