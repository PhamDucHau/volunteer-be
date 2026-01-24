# 📧 CURL COMMANDS ĐỂ TEST GMAIL - DÙNG CHO POSTMAN

## 🚀 QUICK START

**Base URL:** `http://localhost:3000`  
**Method:** `POST`  
**Content-Type:** `application/json`

---

## 1️⃣ TEST GỬI EMAIL ĐƠN GIẢN

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "Test Email từ Volunteer System",
    "html": "<h1 style=\"color: #4CAF50;\">✅ Thành công!</h1><p>Email module hoạt động tốt!</p>",
    "text": "Thành công! Email module hoạt động tốt!"
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "to": "your-email@gmail.com",
  "subject": "Test Email từ Volunteer System",
  "html": "<h1 style=\"color: #4CAF50;\">✅ Thành công!</h1><p>Email module hoạt động tốt!</p>",
  "text": "Thành công! Email module hoạt động tốt!"
}
```

---

## 2️⃣ TEST GỬI EMAIL VỚI HTML ĐẸP

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "Beautiful Email Template",
    "html": "<div style=\"max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;\"><div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;\"><h1 style=\"margin: 0;\">🎉 Volunteer System</h1><p style=\"margin: 10px 0 0 0;\">Cảm ơn bạn đã tham gia!</p></div><div style=\"padding: 30px; background-color: #f9f9f9;\"><h2 style=\"color: #333;\">Thông tin quan trọng</h2><p style=\"color: #666; line-height: 1.6;\">Đây là một email template đẹp với styling CSS.</p></div></div>"
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send`
- **Body (raw JSON):**
```json
{
  "to": "your-email@gmail.com",
  "subject": "Beautiful Email Template",
  "html": "<div style=\"max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;\"><div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;\"><h1 style=\"margin: 0;\">🎉 Volunteer System</h1><p style=\"margin: 10px 0 0 0;\">Cảm ơn bạn đã tham gia!</p></div><div style=\"padding: 30px; background-color: #f9f9f9;\"><h2 style=\"color: #333;\">Thông tin quan trọng</h2><p style=\"color: #666; line-height: 1.6;\">Đây là một email template đẹp với styling CSS.</p></div></div>"
}
```

---

## 3️⃣ TEST GỬI EMAIL VỚI NHIỀU NGƯỜI NHẬN (TO, CC, BCC)

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["recipient1@gmail.com", "recipient2@gmail.com"],
    "cc": "cc@gmail.com",
    "bcc": ["bcc1@gmail.com", "bcc2@gmail.com"],
    "subject": "Test Email - Multiple Recipients",
    "html": "<h2>Test với nhiều người nhận</h2><p>Email này có TO, CC và BCC recipients.</p>"
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send`
- **Body (raw JSON):**
```json
{
  "to": ["recipient1@gmail.com", "recipient2@gmail.com"],
  "cc": "cc@gmail.com",
  "bcc": ["bcc1@gmail.com", "bcc2@gmail.com"],
  "subject": "Test Email - Multiple Recipients",
  "html": "<h2>Test với nhiều người nhận</h2><p>Email này có TO, CC và BCC recipients.</p>"
}
```

---

## 4️⃣ TEST WELCOME EMAIL

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "newuser@gmail.com",
    "userName": "Nguyễn Văn A"
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send-welcome`
- **Body (raw JSON):**
```json
{
  "to": "newuser@gmail.com",
  "userName": "Nguyễn Văn A"
}
```

---

## 5️⃣ TEST PASSWORD RESET EMAIL

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@gmail.com",
    "resetToken": "abc123xyz456token"
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send-password-reset`
- **Body (raw JSON):**
```json
{
  "to": "user@gmail.com",
  "resetToken": "abc123xyz456token"
}
```

---

## 6️⃣ TEST DONATION CONFIRMATION EMAIL

### CURL Command:
```bash
curl -X POST http://localhost:3000/email/send-donation-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "donor@gmail.com",
    "userName": "Trần Thị B",
    "donationDetails": {
      "campaignName": "Chiến dịch Mùa Đông Ấm 2026",
      "items": "10 áo khoác, 5 chăn ấm, 20 đôi găng tay",
      "date": "2026-01-25"
    }
  }'
```

### Postman Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/email/send-donation-confirmation`
- **Body (raw JSON):**
```json
{
  "to": "donor@gmail.com",
  "userName": "Trần Thị B",
  "donationDetails": {
    "campaignName": "Chiến dịch Mùa Đông Ấm 2026",
    "items": "10 áo khoác, 5 chăn ấm, 20 đôi găng tay",
    "date": "2026-01-25"
  }
}
```

---

## 📋 POSTMAN COLLECTION SETUP

### Tạo Collection mới trong Postman:

1. **Click "New"** > **"Collection"**
2. Đặt tên: `Volunteer Email API`
3. **Thêm các requests:**

#### Request 1: Send Simple Email
- Method: `POST`
- URL: `http://localhost:3000/email/send`
- Body: Copy JSON từ mục 1️⃣

#### Request 2: Send Welcome Email
- Method: `POST`
- URL: `http://localhost:3000/email/send-welcome`
- Body: Copy JSON từ mục 4️⃣

#### Request 3: Send Password Reset
- Method: `POST`
- URL: `http://localhost:3000/email/send-password-reset`
- Body: Copy JSON từ mục 5️⃣

#### Request 4: Send Donation Confirmation
- Method: `POST`
- URL: `http://localhost:3000/email/send-donation-confirmation`
- Body: Copy JSON từ mục 6️⃣

---

## ✅ RESPONSE THÀNH CÔNG:

```json
{
  "success": true,
  "messageId": "<unique-id@gmail.com>",
  "message": "Email sent successfully"
}
```

---

## ❌ RESPONSE LỖI:

```json
{
  "statusCode": 500,
  "message": "Failed to send email",
  "error": "Internal Server Error"
}
```

---

## 🔧 TROUBLESHOOTING:

### Lỗi: Connection refused
→ Kiểm tra server đang chạy ở port 3000:
```bash
npm run start:dev
```

### Lỗi: Cannot find module
→ Kiểm tra file `.env` đã được cấu hình đúng chưa

### Lỗi: Invalid credentials
→ Kiểm tra Gmail OAuth credentials trong `.env`

---

## 💡 TIP CHO POSTMAN:

1. **Tạo Environment Variable:**
   - Tạo environment: `Local Development`
   - Thêm variable: `base_url` = `http://localhost:3000`
   - Dùng `{{base_url}}/email/send` trong URL

2. **Save Response:**
   - Click "Save Response" để lưu examples
   - Dùng để test lại sau

3. **Pre-request Script:**
   - Có thể thêm script để tự động thay email

---

## 🎯 TEST NHANH NHẤT:

**Copy curl này và paste vào terminal (thay YOUR_EMAIL):**

```bash
curl -X POST http://localhost:3000/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "subject": "Test từ Postman",
    "html": "<h1>✅ Success!</h1><p>Email đã được gửi thành công!</p>"
  }'
```

**Hoặc import vào Postman:**
1. Click "Import" trong Postman
2. Chọn tab "Raw text"
3. Paste curl command
4. Click "Import"
5. Thay `YOUR_EMAIL` bằng email thật
6. Click "Send"

---

**🚀 Ready to test! Chúc bạn test thành công!**
