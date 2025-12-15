/**
 * メール送信サービス
 * Email sending service using Nodemailer
 */

const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  /**
   * Nodemailerトランスポーターの初期化
   * Initialize Nodemailer transporter
   */
  initialize() {
    try {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure,
        auth: {
          user: emailConfig.smtp.auth.user,
          pass: emailConfig.smtp.auth.pass
        }
      });
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      throw error;
    }
  }

  /**
   * メール送信
   * Send email
   *
   * @param {Object} options - メール送信オプション
   * @param {string} options.to - 送信先メールアドレス
   * @param {string} options.subject - 件名
   * @param {string} options.text - テキスト本文
   * @param {string} options.html - HTML本文
   * @param {string} options.from - 送信元（オプション）
   * @returns {Promise<Object>} 送信結果
   */
  async sendEmail(options) {
    if (!this.transporter) {
      throw new Error('Email service is not initialized');
    }

    const mailOptions = {
      from: options.from || `${emailConfig.defaults.fromName} <${emailConfig.defaults.from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return {
        success: true,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * 接続確認
   * Verify SMTP connection
   *
   * @returns {Promise<boolean>} 接続成功フラグ
   */
  async verifyConnection() {
    if (!this.transporter) {
      throw new Error('Email service is not initialized');
    }

    try {
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      throw error;
    }
  }
}

// シングルトンインスタンスをエクスポート
module.exports = new EmailService();
