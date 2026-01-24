# 📧 EMAIL MODULE - COMPLETE PACKAGE

Đã tạo xong **Email Module** để gửi Gmail thông qua Google Console API với đầy đủ tính năng!

---

## 📦 PACKAGE INCLUDES:

### 1. Source Code Files
```
src/email/
├── dto/
│   └── send-email.dto.ts         # Data Transfer Object
├── email.controller.ts            # REST API Controller (4 endpoints)
├── email.service.ts               # Business Logic Service
├── email.module.ts                # NestJS Module
└── email.examples.ts              # Code examples để integrate
```

✅ Module đã được import vào `app.module.ts`

### 2. Documentation Files
```
📚 EMAIL_MODULE_GUIDE.md          # Hướng dẫn chi tiết setup Google Console
📚 EMAIL_README.md                # Quick start guide
📚 CURL_COMMANDS.md               # Tất cả curl commands để test
📚 INDEX_EMAIL.md                 # File này (tổng quan)
```

### 3. Test Scripts
```
🧪 test-email.sh                  # Script test tự động (full)
🧪 quick-test.sh                  # Script test nhanh
```

### 4. Configuration
```
⚙️ .env.example                   # Template cho environment variables
```

---

## 🚀 QUICK START (3 BƯỚC):

### Bước 1️⃣: Cấu hình Google Console (5 phút)

Làm theo hướng dẫn chi tiết trong `EMAIL_MODULE_GUIDE.md` hoặc:

1. Vào https://console.cloud.google.com/
2. Tạo project → Enable Gmail API
3. Tạo OAuth credentials → Lấy Client ID & Secret
4. Vào https://developers.google.com/oauthplayground
5. Lấy Refresh Token với scope `https://mail.google.com/`

### Bước 2️⃣: Tạo file .env

```bash
GMAIL_CLIENT_ID=your_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
GMAIL_USER=your-email@gmail.com
GMAIL_USER_NAME=Volunteer System
FRONTEND_URL=http://localhost:3000
```

### Bước 3️⃣: Test ngay!

```bash
# Start server
npm run start:dev

# Test trong terminal khác
./quick-test.sh your-email@gmail.com
```

---

## 🎯 API ENDPOINTS:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/send` | Gửi email tùy chỉnh với HTML |
| POST | `/email/send-welcome` | Gửi email chào mừng user mới |
| POST | `/email/send-password-reset` | Gửi email reset mật khẩu |
| POST | `/email/send-donation-confirmation` | Gửi email xác nhận donation |

---

## 💻 CURL COMMANDS NHANH:

### Test Simple Email:
```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "subject": "Test Email",
    "html": "<h1>Success!</h1><p>It works!</p>"
  }'
```

### Test Welcome Email:
```bash
curl -X POST http://localhost:3001/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "userName": "Test User"
  }'
```

**→ Xem tất cả curl commands trong:** `CURL_COMMANDS.md`

---

## 🧪 TEST SCRIPTS:

### Option 1: Quick Test (Tất cả emails 1 lần)
```bash
./quick-test.sh your-email@gmail.com
```

### Option 2: Test từng loại
```bash
./test-email.sh simple your-email@gmail.com    # Email đơn giản
./test-email.sh welcome your-email@gmail.com   # Welcome email
./test-email.sh reset your-email@gmail.com     # Password reset
./test-email.sh donation your-email@gmail.com  # Donation confirm
./test-email.sh all your-email@gmail.com       # Tất cả
```

---

## 💡 SỬ DỤNG TRONG CODE:

### Import module:
```typescript
// your.module.ts
import { EmailModule } from './email/email.module';

@Module({
  imports: [EmailModule],  // ← Add this
  // ...
})
```

### Inject service:
```typescript
// your.service.ts
import { EmailService } from './email/email.service';

constructor(private emailService: EmailService) {}

async someMethod() {
  await this.emailService.sendEmail({
    to: 'user@example.com',
    subject: 'Hello',
    html: '<p>Hello World!</p>',
  });
}
```

**→ Xem full examples trong:** `src/email/email.examples.ts`

---

## ✨ FEATURES:

✅ **OAuth2 Authentication** - Bảo mật cao với Google OAuth2  
✅ **Multiple Recipients** - Hỗ trợ to, cc, bcc  
✅ **HTML Templates** - Email đẹp với HTML/CSS  
✅ **Pre-built Templates** - Welcome, Reset Password, Donation  
✅ **TypeScript** - Full type safety  
✅ **Error Handling** - Logging & error handling đầy đủ  
✅ **Async/Await** - Non-blocking operations  
✅ **Production Ready** - Sẵn sàng cho production  
✅ **Well Documented** - Tài liệu đầy đủ tiếng Việt  
✅ **Test Scripts** - Scripts để test tự động  

---

## 📚 TÀI LIỆU CHI TIẾT:

| File | Mô tả |
|------|-------|
| `EMAIL_README.md` | Quick start guide & tổng quan |
| `EMAIL_MODULE_GUIDE.md` | Hướng dẫn setup Google Console chi tiết |
| `CURL_COMMANDS.md` | Tất cả curl commands để test |
| `src/email/email.examples.ts` | Code examples để integrate |

---

## 🔧 TROUBLESHOOTING:

| Lỗi | Giải pháp |
|-----|-----------|
| Invalid credentials | Kiểm tra GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET |
| Invalid grant | Refresh token hết hạn, lấy token mới |
| Insufficient Permission | Chưa chọn scope đúng trong OAuth Playground |
| Email không đến | Kiểm tra spam folder, xác nhận GMAIL_USER |

**→ Chi tiết troubleshooting trong:** `EMAIL_MODULE_GUIDE.md`

---

## 🎨 CUSTOMIZE:

### Tạo template mới:
```typescript
// Trong email.service.ts
async sendCustomEmail(to: string, data: any) {
  const html = `
    <div style="font-family: Arial; max-width: 600px;">
      <h1>Your Custom Template</h1>
      <p>${data.message}</p>
    </div>
  `;
  
  return this.sendEmail({ to, subject: data.subject, html });
}
```

### Thêm endpoint mới:
```typescript
// Trong email.controller.ts
@Post('send-custom')
async sendCustomEmail(@Body() body: any) {
  return this.emailService.sendCustomEmail(body.to, body.data);
}
```

---

## 📊 PRODUCTION CHECKLIST:

- [ ] Đã setup Google Cloud Project
- [ ] Đã enable Gmail API
- [ ] Đã tạo OAuth credentials
- [ ] Đã lấy refresh token
- [ ] Đã config .env với credentials thật
- [ ] Đã test gửi email thành công
- [ ] Đã integrate vào auth/donation modules
- [ ] Đã setup error logging
- [ ] Đã configure FRONTEND_URL production
- [ ] Đã backup refresh token an toàn

---

## 🚀 NEXT STEPS:

1. **Test ngay** với email của bạn
2. **Integrate** vào Auth module (register, forgot password)
3. **Integrate** vào Donation module (confirmation emails)
4. **Customize** HTML templates theo design của bạn
5. **Add more templates** (verification, notification, etc.)
6. **Deploy** lên production

---

## 📞 NEED HELP?

1. Đọc `EMAIL_MODULE_GUIDE.md` để biết chi tiết
2. Xem `src/email/email.examples.ts` để biết cách integrate
3. Chạy `./quick-test.sh` để test nhanh

---

**💡 TIP:** Bắt đầu với việc test simple email trước, sau đó mới customize templates!

**🎉 READY TO USE!** Module hoàn chỉnh và sẵn sàng cho production!
