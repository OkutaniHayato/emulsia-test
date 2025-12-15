/**
 * 設定管理サービス
 * Settings management service
 */

const fs = require('fs').promises;
const path = require('path');

class SettingsService {
  constructor() {
    this.settingsPath = path.join(__dirname, '../../data/settings.json');
    this.defaultSettings = {
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: ''
        }
      },
      defaults: {
        from: 'noreply@example.com',
        fromName: 'Emulsia System'
      },
      notifications: {
        welcome: true,
        passwordReset: true,
        systemUpdate: false,
        securityAlert: true
      }
    };
  }

  /**
   * 設定ファイルの初期化
   * Initialize settings file
   */
  async initialize() {
    try {
      const dataDir = path.join(__dirname, '../../data');
      await fs.mkdir(dataDir, { recursive: true });

      try {
        await fs.access(this.settingsPath);
      } catch {
        // 設定ファイルが存在しない場合、デフォルト設定で作成
        await this.saveSettings(this.defaultSettings);
      }
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      throw error;
    }
  }

  /**
   * 設定を読み込む
   * Load settings
   *
   * @returns {Promise<Object>} 設定オブジェクト
   */
  async loadSettings() {
    try {
      const data = await fs.readFile(this.settingsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaultSettings;
    }
  }

  /**
   * 設定を保存する
   * Save settings
   *
   * @param {Object} settings - 保存する設定
   * @returns {Promise<void>}
   */
  async saveSettings(settings) {
    try {
      await fs.writeFile(
        this.settingsPath,
        JSON.stringify(settings, null, 2),
        'utf-8'
      );
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  /**
   * SMTP設定を更新
   * Update SMTP settings
   *
   * @param {Object} smtpConfig - SMTP設定
   * @returns {Promise<Object>} 更新後の設定
   */
  async updateSMTPSettings(smtpConfig) {
    const settings = await this.loadSettings();

    settings.smtp = {
      ...settings.smtp,
      ...smtpConfig,
      auth: {
        ...settings.smtp.auth,
        ...(smtpConfig.auth || {})
      }
    };

    await this.saveSettings(settings);
    return settings;
  }

  /**
   * 通知設定を更新
   * Update notification settings
   *
   * @param {Object} notificationConfig - 通知設定
   * @returns {Promise<Object>} 更新後の設定
   */
  async updateNotificationSettings(notificationConfig) {
    const settings = await this.loadSettings();

    settings.notifications = {
      ...settings.notifications,
      ...notificationConfig
    };

    await this.saveSettings(settings);
    return settings;
  }

  /**
   * デフォルト送信者設定を更新
   * Update default sender settings
   *
   * @param {Object} defaultsConfig - デフォルト設定
   * @returns {Promise<Object>} 更新後の設定
   */
  async updateDefaultSettings(defaultsConfig) {
    const settings = await this.loadSettings();

    settings.defaults = {
      ...settings.defaults,
      ...defaultsConfig
    };

    await this.saveSettings(settings);
    return settings;
  }

  /**
   * 設定をリセット
   * Reset settings to defaults
   *
   * @returns {Promise<Object>} デフォルト設定
   */
  async resetSettings() {
    await this.saveSettings(this.defaultSettings);
    return this.defaultSettings;
  }

  /**
   * 特定の通知が有効かチェック
   * Check if a specific notification is enabled
   *
   * @param {string} notificationType - 通知タイプ
   * @returns {Promise<boolean>} 有効フラグ
   */
  async isNotificationEnabled(notificationType) {
    const settings = await this.loadSettings();
    return settings.notifications[notificationType] || false;
  }
}

// シングルトンインスタンスをエクスポート
module.exports = new SettingsService();
