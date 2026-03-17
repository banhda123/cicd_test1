const bcrypt = require('bcryptjs');
const db = require('./src/models');

async function createAdmin() {
  try {
    // Connect to database
    await db.sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database
    await db.sequelize.sync();
    console.log('✅ Database synced');

    const { User } = db.models;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@gmail.com' } 
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await User.create({
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@gmail.com',
      passwordHash: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
      phone: '0000000000'
    });

    console.log('✅ Admin created successfully:');
    console.log('   Email: admin@gmail.com');
    console.log('   Password: 123456');
    console.log('   Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
