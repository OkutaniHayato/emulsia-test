# emulsia-test

Claude for Chrome 検証用

## メール通知機能

このプロジェクトには、Nodemailerを使用したメール通知機能が実装されています。

### 機能一覧

#### 1. メール送信サービス (Issue #1)
- Nodemailerの設定と初期化
- メール送信機能
- SMTP接続確認機能
- 環境変数による設定管理

#### 2. メールテンプレート (Issue #2)
- HTMLテンプレート
  - ウェルカムメール
  - 通知メール
  - パスワードリセットメール
- テキストテンプレート（HTML非対応クライアント用）
- テンプレートエンジン
  - 変数置き換え機能
  - テンプレートレンダリング機能

#### 3. メール送信設定画面 (Issue #3)
- SMTP設定管理画面
- 通知設定のカスタマイズ
- 接続テスト機能
- 設定の保存・読み込み

### セットアップ

1. 依存パッケージのインストール
```bash
npm install
```

2. 環境変数の設定

`.env.example` を `.env` にコピーして、SMTP設定を記入してください。

```bash
cp .env.example .env
```

3. `.env` ファイルの編集
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
DEFAULT_FROM_EMAIL=noreply@example.com
DEFAULT_FROM_NAME=Emulsia System
```

### 使い方

#### メール送信サービスの使用

```javascript
const emailService = require('./src/services/emailService');

// メールを送信
await emailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'テスト件名',
  text: 'テキスト本文',
  html: '<p>HTML本文</p>'
});

// SMTP接続確認
await emailService.verifyConnection();
```

#### テンプレートサービスの使用

```javascript
const templateService = require('./src/services/templateService');

// ウェルカムメールのレンダリング
const { html, text } = await templateService.renderWelcomeEmail({
  userName: '太郎さん',
  activationUrl: 'https://example.com/activate/token123'
});
```

#### 設定画面

設定画面は `public/email-settings.html` から開くことができます。

### ファイル構成

```
emulsia-test/
├── src/
│   ├── api/
│   │   └── settingsController.js    # 設定API
│   ├── config/
│   │   └── emailConfig.js           # メール設定
│   ├── services/
│   │   ├── emailService.js          # メール送信サービス
│   │   ├── templateService.js       # テンプレートサービス
│   │   └── settingsService.js       # 設定管理サービス
│   └── templates/
│       └── email/
│           ├── welcome.html         # ウェルカムメール(HTML)
│           ├── welcome.txt          # ウェルカムメール(TEXT)
│           ├── notification.html    # 通知メール(HTML)
│           ├── notification.txt     # 通知メール(TEXT)
│           ├── passwordReset.html   # パスワードリセット(HTML)
│           └── passwordReset.txt    # パスワードリセット(TEXT)
├── public/
│   └── email-settings.html          # メール設定画面
├── .env.example                     # 環境変数サンプル
└── package.json
```

### 注意事項

- Gmailを使用する場合は、アプリパスワードを使用してください
- 本番環境では、環境変数を適切に管理してください
- セキュリティ上の理由から、`.env` ファイルは `.gitignore` に追加してください
