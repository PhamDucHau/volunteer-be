# Quick CURL Commands để Test Email Module

## Thay YOUR_EMAIL bằng email thật của bạn để test

## 1. Test Simple Email
```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "subject": "Test Email từ Volunteer System",
    "html": "<div style=\"font-family: Arial, sans-serif;\"><h1 style=\"color: #4CAF50;\">Xin chào!</h1><p>Đây là email test từ hệ thống Volunteer.</p><p><strong>Module email hoạt động tốt!</strong></p></div>",
    "text": "Xin chào! Đây là email test từ hệ thống Volunteer."
  }'
```

## 2. Test Welcome Email
```bash
curl -X POST http://localhost:3001/email/send-welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "userName": "Nguyễn Văn A"
  }'
```

## 3. Test Password Reset Email
```bash
curl -X POST http://localhost:3001/email/send-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "resetToken": "abc123xyz456token"
  }'
```

## 4. Test Donation Confirmation Email
```bash
curl -X POST http://localhost:3001/email/send-donation-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "userName": "Trần Thị B",
    "donationDetails": {
      "campaignName": "Hỗ trợ mùa đông 2026",
      "items": "10 áo khoác, 5 chăn ấm, 20 đôi găng tay",
      "date": "2026-01-25"
    }
  }'
```

## 5. Test Email với Multiple Recipients
```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["YOUR_EMAIL@gmail.com", "recipient2@gmail.com"],
    "cc": "cc@gmail.com",
    "subject": "Test Multiple Recipients",
    "html": "<h2>Test với nhiều người nhận</h2><p>Email này có CC recipients.</p>"
  }'
```

## 6. Test Email với HTML phức tạp
```bash
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL@gmail.com",
    "subject": "Beautiful Email Template",
    "html": "<div style=\"max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;\"><div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;\"><h1 style=\"margin: 0;\">🎉 Volunteer System</h1><p style=\"margin: 10px 0 0 0;\">Cảm ơn bạn đã tham gia!</p></div><div style=\"padding: 30px; background-color: #f9f9f9;\"><h2 style=\"color: #333;\">Thông tin quan trọng</h2><p style=\"color: #666; line-height: 1.6;\">Đây là một email template đẹp với styling CSS. Bạn có thể customize theo ý muốn.</p><div style=\"background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;\"><h3 style=\"color: #667eea; margin-top: 0;\">Highlights:</h3><ul style=\"color: #666;\"><li>✅ Email gửi thành công</li><li>✅ HTML styling hoạt động</li><li>✅ Responsive design</li></ul></div><a href=\"http://localhost:3000\" style=\"display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px;\">Truy cập Website</a></div><div style=\"background-color: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;\"><p>© 2026 Volunteer System. All rights reserved.</p></div></div>"
  }'
```

## Test bằng script (Dễ hơn)

Hoặc sử dụng test script có sẵn:

```bash
# Chạy 1 test đơn
./test-email.sh simple YOUR_EMAIL@gmail.com

# Chạy tất cả tests
./test-email.sh all YOUR_EMAIL@gmail.com
```

## Kiểm tra Response

Response thành công:
```json
{
  "success": true,
  "messageId": "<unique-id@gmail.com>",
  "message": "Email sent successfully"
}
```

Response lỗi:
```json
{
  "statusCode": 500,
  "message": "Error message here"
}
```

## Notes
- Đảm bảo server đang chạy ở port 3001
- Kiểm tra file .env đã được cấu hình đúng
- Thay YOUR_EMAIL@gmail.com bằng email thật của bạn
- Check spam folder nếu không thấy email trong inbox
