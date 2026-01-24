# Email Module - Gmail Integration Guide

## Overview
Module này cho phép gửi email thông qua Gmail sử dụng Google OAuth2 API.

## Cài đặt

Dependencies đã được cài đặt sẵn:
- `googleapis`: ^170.1.0
- `nodemailer`: ^7.0.12

## Cấu hình Gmail OAuth2

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project có sẵn
3. Enable Gmail API:
   - Vào "APIs & Services" > "Library"
   - Tìm "Gmail API" và click Enable

### Bước 2: Tạo OAuth 2.0 Credentials

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Nếu chưa có, tạo OAuth consent screen:
   - User Type: External
   - App name: Volunteer System
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
4. Chọn Application type: "Web application"
5. Authorized redirect URIs: `https://developers.google.com/oauthplayground`
6. Lưu lại `Client ID` và `Client Secret`

### Bước 3: Lấy Refresh Token

1. Truy cập [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click vào icon ⚙️ (Settings) ở góc trên bên phải
3. Check "Use your own OAuth credentials"
4. Nhập `OAuth Client ID` và `OAuth Client Secret` vừa tạo
5. Ở bên trái, tìm "Gmail API v1" và chọn scope:
   - `https://mail.google.com/`
6. Click "Authorize APIs"
7. Đăng nhập với Gmail account của bạn
8. Click "Exchange authorization code for tokens"
9. Copy `Refresh token`

### Bước 4: Cấu hình Environment Variables

Tạo file `.env` trong thư mục root với nội dung:

```env
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your-email@gmail.com
GMAIL_USER_NAME=Volunteer System

FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### 1. Gửi Email Tùy Chỉnh
**POST** `/email/send`

```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@gmail.com",
    "subject": "Test Email",
    "html": "<h1>Hello</h1><p>This is a test email from Volunteer System!</p>",
    "text": "Hello, This is a test email from Volunteer System!"
  }'
```

Với nhiều người nhận:
```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient1@gmail.com", "recipient2@gmail.com"],
    "subject": "Test Email",
    "html": "<h1>Hello</h1><p>This is a test email!</p>",
    "cc": "cc@gmail.com",
    "bcc": ["bcc1@gmail.com", "bcc2@gmail.com"]
  }'
```

### 2. Gửi Email Chào Mừng
**POST** `/email/send-welcome`

```bash
curl -X POST http://localhost:3001/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "newuser@gmail.com",
    "userName": "John Doe"
  }'
```

### 3. Gửi Email Reset Password
**POST** `/email/send-password-reset`

```bash
curl -X POST http://localhost:3001/email/send-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@gmail.com",
    "resetToken": "abc123xyz456"
  }'
```

### 4. Gửi Email Xác Nhận Donation
**POST** `/email/send-donation-confirmation`

```bash
curl -X POST http://localhost:3001/email/send-donation-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "donor@gmail.com",
    "userName": "Jane Smith",
    "donationDetails": {
      "campaignName": "Winter Clothing Drive",
      "items": "10 jackets, 5 blankets",
      "date": "2026-01-25"
    }
  }'
```

## Response Format

Thành công:
```json
{
  "success": true,
  "messageId": "<message-id@gmail.com>",
  "message": "Email sent successfully"
}
```

Lỗi:
```json
{
  "statusCode": 500,
  "message": "Failed to send email",
  "error": "Internal Server Error"
}
```

## Sử dụng trong Code

Import EmailService vào module của bạn:

```typescript
import { EmailService } from './email/email.service';

@Injectable()
export class YourService {
  constructor(private emailService: EmailService) {}

  async someMethod() {
    await this.emailService.sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hello World!</p>',
    });
  }
}
```

## Troubleshooting

### Lỗi: "Invalid grant"
- Refresh token đã hết hạn, lấy lại refresh token mới từ OAuth Playground

### Lỗi: "Insufficient Permission"
- Kiểm tra lại scopes trong OAuth Playground, đảm bảo đã chọn `https://mail.google.com/`

### Lỗi: "Daily sending quota exceeded"
- Gmail có giới hạn gửi email mỗi ngày (500 emails/day cho tài khoản thường)
- Nâng cấp lên Google Workspace để tăng quota

### Lỗi: "The user has not granted the app..."
- Quay lại OAuth consent screen và thêm email của bạn vào Test users
- Hoặc publish app để công khai

## Security Notes

- Không commit file `.env` vào Git
- Refresh token có thể sử dụng lâu dài, bảo mật cẩn thận
- Nên rotate credentials định kỳ
- Sử dụng environment-specific configs cho production

## Testing

Chạy lệnh này để test nhanh (thay YOUR_EMAIL):

```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"YOUR_EMAIL@gmail.com\",
    \"subject\": \"Test Email from Volunteer System\",
    \"html\": \"<div style='font-family: Arial;'><h1 style='color: #4CAF50;'>Success!</h1><p>Email module is working correctly!</p><p>Sent at: $(date)</p></div>\"
  }"
```

## Production Checklist

- [ ] Đã cấu hình đúng GMAIL_* environment variables
- [ ] Đã test gửi email thành công
- [ ] Đã enable Gmail API trong Google Cloud Console
- [ ] Đã publish OAuth consent screen (nếu cần)
- [ ] Đã set up monitoring cho email failures
- [ ] Đã configure FRONTEND_URL cho production domain
- [ ] Đã backup refresh token an toàn

## Support

Nếu gặp vấn đề, kiểm tra logs:
```bash
# Development
npm run start:dev

# Check logs
tail -f logs/app.log
```
