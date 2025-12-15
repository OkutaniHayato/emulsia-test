/**
 * メール送信設定
 * Email configuration settings
 */

module.exports = {
  // SMTP設定
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },

  // デフォルト送信者情報
  defaults: {
    from: process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com',
    fromName: process.env.DEFAULT_FROM_NAME || 'Emulsia System'
  }
};
