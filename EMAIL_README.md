# 📧 EMAIL MODULE - HƯỚNG DẪN NHANH

## ✅ Đã tạo xong module gửi Gmail với Google Console

### 📁 Files đã tạo:

```
src/email/
├── dto/
│   └── send-email.dto.ts          # DTO cho request
├── email.controller.ts             # Controller với 4 endpoints
├── email.service.ts                # Service xử lý logic gửi email
└── email.module.ts                 # Module definition

Và 3 files hướng dẫn:
├── EMAIL_MODULE_GUIDE.md          # Hướng dẫn chi tiết setup
├── CURL_COMMANDS.md               # Các lệnh curl để test
├── test-email.sh                  # Script test tự động
└── .env.example                   # Template cho .env
```

## 🚀 BƯỚC LÀM NHANH:

### Bước 1: Cấu hình Google Console (5 phút)

1. Vào https://console.cloud.google.com/
2. Tạo project mới
3. Enable "Gmail API"
4. Tạo OAuth 2.0 credentials
5. Lấy Client ID và Client Secret

### Bước 2: Lấy Refresh Token (3 phút)

1. Vào https://developers.google.com/oauthplayground
2. Settings (⚙️) > Check "Use your own OAuth credentials"
3. Nhập Client ID và Client Secret
4. Chọn scope: `https://mail.google.com/`
5. Authorize và lấy Refresh Token

### Bước 3: Tạo file .env

```bash
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your-email@gmail.com
GMAIL_USER_NAME=Volunteer System
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

### Bước 4: Start server

```bash
npm run start:dev
# hoặc
yarn start:dev
```

## 🧪 TEST NGAY (Copy & Paste):

### Test đơn giản nhất (Thay YOUR_EMAIL):

```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "subject": "Test từ Volunteer System",
    "html": "<h1>Thành công!</h1><p>Email module đã hoạt động!</p>"
  }'
```

### Hoặc dùng script:

```bash
./test-email.sh simple YOUR_EMAIL@gmail.com
```

### Test tất cả:

```bash
./test-email.sh all YOUR_EMAIL@gmail.com
```

## 📝 CÁC API ENDPOINTS:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/email/send` | POST | Gửi email tùy chỉnh |
| `/email/send-welcome` | POST | Gửi email chào mừng |
| `/email/send-password-reset` | POST | Gửi email reset password |
| `/email/send-donation-confirmation` | POST | Gửi email xác nhận donation |

## 💡 SỬ DỤNG TRONG CODE:

```typescript
// Trong service/controller khác
import { EmailService } from './email/email.service';

constructor(private emailService: EmailService) {}

// Gửi email đơn giản
await this.emailService.sendEmail({
  to: 'user@gmail.com',
  subject: 'Hello',
  html: '<p>Hello World!</p>',
});

// Gửi welcome email
await this.emailService.sendWelcomeEmail(
  'newuser@gmail.com',
  'John Doe'
);

// Gửi reset password
await this.emailService.sendPasswordResetEmail(
  'user@gmail.com',
  'reset-token-123'
);
```

## 🔍 TROUBLESHOOTING:

### Lỗi "Invalid credentials"
→ Kiểm tra lại GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET trong .env

### Lỗi "Invalid grant"
→ Refresh token hết hạn, lấy lại token mới từ OAuth Playground

### Lỗi "Insufficient Permission"
→ Chưa chọn đúng scope `https://mail.google.com/` trong OAuth Playground

### Email không đến
→ Kiểm tra spam folder
→ Kiểm tra GMAIL_USER trong .env có đúng không

## 📚 TÀI LIỆU CHI TIẾT:

- `EMAIL_MODULE_GUIDE.md` - Hướng dẫn đầy đủ
- `CURL_COMMANDS.md` - Tất cả lệnh curl để test
- `test-email.sh` - Script test tự động

## ✨ FEATURES:

✅ Gửi email với HTML template
✅ Hỗ trợ multiple recipients (to, cc, bcc)
✅ Template có sẵn (welcome, reset password, donation)
✅ OAuth2 authentication với Google
✅ Logging đầy đủ
✅ Error handling
✅ TypeScript support
✅ Ready cho production

## 🎯 NEXT STEPS:

1. Cấu hình .env với credentials thật
2. Test với email của bạn
3. Customize HTML templates theo ý muốn
4. Integrate vào auth/donation modules
5. Deploy lên production

---

**Cần hỗ trợ?** Đọc file EMAIL_MODULE_GUIDE.md để biết chi tiết!
