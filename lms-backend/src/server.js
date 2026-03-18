require('dotenv').config();
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
    console.warn('⚠️ JWT_SECRET is not set (dev only)');
  }

  // Optional
  if (!process.env.ALLOWED_ORIGINS) {
    console.warn('⚠️ ALLOWED_ORIGINS not set');
  }
};

(async () => {
  try {
    validateEnv();

    // ✅ Connect DB
    await connectDB();
    console.log('✅ Database connected');

    const server = http.createServer(app);
    initSocket(server);

    // ✅ Start server BEFORE email (tránh bị treo)
    server.listen(PORT, '0.0.0.0', async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 API: /api`);

      // ✅ Email check chạy async, không block server
      try {
        const emailConnected = await emailService.verifyEmailConnection();
        if (!emailConnected) {
          console.warn('⚠️ Email service not configured');
        } else {
          console.log('✅ Email service ready');
        }
      } catch (err) {
        console.warn('⚠️ Email error:', err.message);
      }
    });

  } catch (error) {
    console.error('❌ Startup error:', error.message);
    process.exit(1);
  }
})();