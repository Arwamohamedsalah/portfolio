const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arwamohamedsalah05_db_user:Arwa%4056789@cluster0.dzf1tgl.mongodb.net/portfolio?retryWrites=true&w=majority';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'arwamohamedsalah05@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Arwa2030';

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin exists with the desired admin email
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (admin) {
      admin.password = ADMIN_PASSWORD;
      await admin.save();
      console.log('⚠️ Admin user already exists. Password has been reset.');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('Please change the password after login.');
      process.exit(0);
    }

    // If another admin exists, update it to use the desired admin email and password
    admin = await User.findOne({ role: 'admin' });
    if (admin) {
      admin.email = ADMIN_EMAIL;
      admin.password = ADMIN_PASSWORD;
      admin.username = 'admin';
      await admin.save();
      console.log('⚠️ Existing admin user updated to the requested login credentials.');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('Please change the password after login.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('\n⚠️ IMPORTANT: Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();

