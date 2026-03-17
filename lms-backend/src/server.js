require('dotenv').config();
console.log('Environment variables loaded:', Object.keys(process.env).filter(key => key.includes('DB_') || key.includes('PORT') || key.includes('NODE_ENV')).length);
const app = require('./app');
const { connectDB } = require('./models');
const emailService = require('./services/email.service');
const http = require('http');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

console.log('Starting server...');

const requireEnv = (name) => {
  const v = process.env[name];
  if (v == null || String(v).trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
};

const validateEnv = () => {
  const isProd = String(process.env.NODE_ENV || '').toLowerCase() === 'production';

  // Required
  requireEnv('DB_NAME');
  requireEnv('DB_USER');
  requireEnv('DB_HOST');
  if (isProd) {
    requireEnv('JWT_SECRET');
  } else if (!process.env.JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET is not set. Using default insecure secret (development only).');
  }

  // Optional but recommended
  if (!process.env.ALLOWED_ORIGINS) {
    console.warn('⚠️  ALLOWED_ORIGINS is not set. Using default localhost origins.');
  }
};

(async () => {
  try {
    validateEnv();

    // Kết nối database
    await connectDB();

    // Auto sync database cho production (chạy 1 lần khi start)
    if (process.env.NODE_ENV === 'production') {
      try {
        await require('./models').sequelize.sync({ alter: true });
        console.log('✅ Database synced for production');
      } catch (error) {
        console.error('⚠️ Database sync error:', error.message);
      }
    }

    // ❌ Bỏ qua kiểm tra email để tránh timeout
    console.log('⚠️ Email verification skipped - will check when sending emails');

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`✓ Server chạy trên port ${PORT}`);
      console.log(`✓ API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Lỗi khởi động server:', error.message);
    process.exit(1);
  }
})();