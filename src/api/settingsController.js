/**
 * 設定API コントローラー
 * Settings API controller
 */

const settingsService = require('../services/settingsService');
const emailService = require('../services/emailService');

class SettingsController {
  /**
   * 全設定を取得
   * Get all settings
   *
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async getSettings(req, res) {
    try {
      const settings = await settingsService.loadSettings();

      // パスワードをマスク
      const safeSettings = {
        ...settings,
        smtp: {
          ...settings.smtp,
          auth: {
            user: settings.smtp.auth.user,
            pass: settings.smtp.auth.pass ? '••••••••' : ''
          }
        }
      };

      res.status(200).json({
        success: true,
        data: safeSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * 設定を更新
   * Update settings
   *
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async updateSettings(req, res) {
    try {
      const { smtp, defaults, notifications } = req.body;

      if (smtp) {
        await settingsService.updateSMTPSettings(smtp);
      }

      if (defaults) {
        await settingsService.updateDefaultSettings(defaults);
      }

      if (notifications) {
        await settingsService.updateNotificationSettings(notifications);
      }

      const updatedSettings = await settingsService.loadSettings();

      res.status(200).json({
        success: true,
        message: '設定が正常に更新されました',
        data: updatedSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * SMTP接続テスト
   * Test SMTP connection
   *
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async testConnection(req, res) {
    try {
      const isConnected = await emailService.verifyConnection();

      res.status(200).json({
        success: true,
        message: 'SMTP接続が正常に確認されました',
        connected: isConnected
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'SMTP接続に失敗しました: ' + error.message
      });
    }
  }

  /**
   * テストメール送信
   * Send test email
   *
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async sendTestEmail(req, res) {
    try {
      const { to } = req.body;

      if (!to) {
        return res.status(400).json({
          success: false,
          error: '送信先メールアドレスが指定されていません'
        });
      }

      const result = await emailService.sendEmail({
        to: to,
        subject: 'Emulsia テストメール',
        text: 'これはテストメールです。メール送信機能が正常に動作しています。',
        html: '<p>これはテストメールです。</p><p>メール送信機能が正常に動作しています。</p>'
      });

      res.status(200).json({
        success: true,
        message: 'テストメールが正常に送信されました',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'テストメールの送信に失敗しました: ' + error.message
      });
    }
  }

  /**
   * 設定をリセット
   * Reset settings
   *
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} res - レスポンスオブジェクト
   */
  async resetSettings(req, res) {
    try {
      const defaultSettings = await settingsService.resetSettings();

      res.status(200).json({
        success: true,
        message: '設定がデフォルトにリセットされました',
        data: defaultSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SettingsController();
