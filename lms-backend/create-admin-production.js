require('dotenv').config();
const { sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');
const { User } = require('./src/models').models;

async function createAdmin() {
  try {
    console.log('🔧 Creating admin account for Render PRODUCTION...');
    
    // Sử dụng DATABASE_URL nếu có (Render)
    if (process.env.DATABASE_URL) {
      console.log('🔗 Using DATABASE_URL from Render');
      await sequelize.authenticate();
    } else {
      console.log('🔗 Using individual DB credentials');
      await sequelize.authenticate();
    }
    
    console.log('✅ Database connected');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@lms.com' } 
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin account already exists');
      console.log('📧 Email: admin@lms.com');
      console.log('🔐 Password: admin123456');
      return;
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash('admin123456', 10);
    
    // Tạo admin account
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@lms.com',
      password: passwordHash,
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@lms.com');
    console.log('🔐 Password: admin123456');
    console.log('🔗 Login: https://lms-backend-iunr.onrender.com/api/auth/login');
    console.log('🎯 Use these credentials to test admin APIs');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    console.error('🔍 Full error:', error);
  } finally {
    await sequelize.close();
  }
}

// Chạy script
createAdmin();
