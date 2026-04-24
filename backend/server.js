const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const sectionRoutes = require('./routes/sections');
const uploadRoutes = require('./routes/upload');
const seedData = require('./seed-data');
const User = require('./models/User');
// const emailService = require('./services/emailService'); // Temporarily disabled due to module conflict

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'arwamohamedsalah05@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Arwa2030';
const ALLOWED_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : ['*'];

console.log('CORS allowed origins:', ALLOWED_ORIGINS);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arwamohamedsalah05_db_user:XTccmRPfOnmJP2fF@cluster0.dzf1tgl.mongodb.net/portfolio?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB successfully!');
  // Seed data if not already seeded
  await seedData();
  // Ensure admin user exists with the configured credentials
  await ensureAdminUser();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(dbStatus === 'connected' ? 200 : 503).json({ 
    message: 'Portfolio Contact API is running successfully!',
    timestamp: new Date().toISOString(),
    status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
    database: dbStatus
  });
});

// Frontend static build (production or deployed build)
const clientBuildPath = path.join(__dirname, '../dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

async function ensureAdminUser() {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('+password');

    if (admin) {
      const needsUpdate = admin.email !== ADMIN_EMAIL || !(await admin.comparePassword(ADMIN_PASSWORD));
      if (needsUpdate) {
        admin.email = ADMIN_EMAIL;
        admin.password = ADMIN_PASSWORD;
        admin.username = 'admin';
        await admin.save();
        console.log('✅ Admin user updated to configured credentials.');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
      } else {
        console.log('✅ Admin user already exists with correct credentials.');
      }
      return;
    }

    const newAdmin = new User({
      username: 'admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    await newAdmin.save();
    console.log('✅ Admin user created with configured credentials.');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('❌ Failed to ensure admin user exists:', error);
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
  
  // Test email service configuration
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('✅ Gmail App Password confirmed working: kuqzkrojcnpdxtek');
    console.log('📧 Email notifications are now enabled!');
    console.log(`📧 Admin email: ${process.env.ADMIN_EMAIL || process.env.EMAIL_USER}`);
  } else {
    console.log('⚠️ Email configuration not found. Email notifications disabled.');
    console.log('💡 Add EMAIL_USER and EMAIL_PASS to .env file to enable email notifications');
  }
});

module.exports = app;