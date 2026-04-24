const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arwamohamedsalah05_db_user:Arwa%4056789@cluster0.dzf1tgl.mongodb.net/portfolio?retryWrites=true&w=majority';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@portfolio.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('Email: admin@portfolio.com');
      console.log('You can login with this email and your password.');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@portfolio.com',
      password: 'admin123', // Change this password!
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Email: admin@portfolio.com');
    console.log('Password: admin123');
    console.log('\n⚠️ IMPORTANT: Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

