module.exports = {
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD, // Hỗ trợ cả 2 biến
  fromEmail: process.env.EMAIL_FROM,
  fromName: process.env.EMAIL_FROM_NAME || 'LMS System',
  verifyExpire: process.env.EMAIL_VERIFY_EXPIRE || '24h',
  resetPasswordExpire: process.env.RESET_PASSWORD_EXPIRE || '1h',
};
