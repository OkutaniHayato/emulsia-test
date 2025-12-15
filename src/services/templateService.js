/**
 * メールテンプレートサービス
 * Email template service for loading and rendering templates
 */

const fs = require('fs').promises;
const path = require('path');

class TemplateService {
  constructor() {
    this.templatesPath = path.join(__dirname, '../templates/email');
  }

  /**
   * テンプレートを読み込み、変数を置き換える
   * Load template and replace variables
   *
   * @param {string} templateName - テンプレート名（拡張子なし）
   * @param {Object} variables - 置き換える変数のオブジェクト
   * @returns {Promise<Object>} HTML版とテキスト版のコンテンツ
   */
  async renderTemplate(templateName, variables = {}) {
    try {
      const htmlPath = path.join(this.templatesPath, `${templateName}.html`);
      const txtPath = path.join(this.templatesPath, `${templateName}.txt`);

      const [htmlTemplate, txtTemplate] = await Promise.all([
        fs.readFile(htmlPath, 'utf-8'),
        fs.readFile(txtPath, 'utf-8')
      ]);

      return {
        html: this.replaceVariables(htmlTemplate, variables),
        text: this.replaceVariables(txtTemplate, variables)
      };
    } catch (error) {
      console.error(`Failed to render template ${templateName}:`, error);
      throw error;
    }
  }

  /**
   * テンプレート内の変数を置き換える
   * Replace variables in template
   *
   * @param {string} template - テンプレート文字列
   * @param {Object} variables - 置き換える変数
   * @returns {string} 変数が置き換えられたテンプレート
   */
  replaceVariables(template, variables) {
    let result = template;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, variables[key]);
    });

    return result;
  }

  /**
   * ウェルカムメールテンプレートをレンダリング
   * Render welcome email template
   *
   * @param {Object} data - テンプレートデータ
   * @param {string} data.userName - ユーザー名
   * @param {string} data.activationUrl - アクティベーションURL
   * @returns {Promise<Object>} レンダリング済みテンプレート
   */
  async renderWelcomeEmail(data) {
    return this.renderTemplate('welcome', data);
  }

  /**
   * 通知メールテンプレートをレンダリング
   * Render notification email template
   *
   * @param {Object} data - テンプレートデータ
   * @param {string} data.userName - ユーザー名
   * @param {string} data.notificationTitle - 通知タイトル
   * @param {string} data.notificationMessage - 通知メッセージ
   * @param {string} data.actionUrl - アクションURL
   * @returns {Promise<Object>} レンダリング済みテンプレート
   */
  async renderNotificationEmail(data) {
    return this.renderTemplate('notification', data);
  }

  /**
   * パスワードリセットメールテンプレートをレンダリング
   * Render password reset email template
   *
   * @param {Object} data - テンプレートデータ
   * @param {string} data.userName - ユーザー名
   * @param {string} data.resetUrl - リセットURL
   * @param {string} data.expiryHours - 有効期限（時間）
   * @returns {Promise<Object>} レンダリング済みテンプレート
   */
  async renderPasswordResetEmail(data) {
    return this.renderTemplate('passwordReset', data);
  }
}

// シングルトンインスタンスをエクスポート
module.exports = new TemplateService();
