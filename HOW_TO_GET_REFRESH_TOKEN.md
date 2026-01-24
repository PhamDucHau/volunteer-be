# 🔑 CÁCH LẤY GMAIL_REFRESH_TOKEN

## 📍 TỔNG QUAN:

`GMAIL_REFRESH_TOKEN` được lấy từ **OAuth 2.0 Playground** của Google. Đây là token dùng để tự động lấy Access Token mới mỗi khi gửi email.

---

## 🚀 HƯỚNG DẪN TỪNG BƯỚC:

### ⚠️ YÊU CẦU TRƯỚC:
Bạn cần có sẵn:
- ✅ `GMAIL_CLIENT_ID` 
- ✅ `GMAIL_CLIENT_SECRET`

(Nếu chưa có, xem file `HOW_TO_GET_GMAIL_SECRET.md`)

---

### BƯỚC 1: Vào OAuth 2.0 Playground

👉 Truy cập: **https://developers.google.com/oauthplayground**

---

### BƯỚC 2: Cấu hình OAuth Credentials

1. **Click icon ⚙️ (Settings)** ở góc trên bên phải

2. **Check ✅ "Use your own OAuth credentials"**

3. **Nhập thông tin:**
   - **OAuth Client ID**: Paste `GMAIL_CLIENT_ID` của bạn
   - **OAuth Client secret**: Paste `GMAIL_CLIENT_SECRET` của bạn

4. **Click "Close"**

---

### BƯỚC 3: Chọn Gmail API Scope

1. Ở **sidebar bên trái**, tìm mục **"Gmail API v1"**

2. **Mở rộng** mục này (click vào mũi tên)

3. **Tìm và check ✅ scope này:**
   ```
   https://mail.google.com/
   ```
   ⚠️ **QUAN TRỌNG:** Phải chọn scope `https://mail.google.com/` (full access), không phải scope khác!

4. **Click nút "Authorize APIs"** (màu xanh) ở dưới cùng

---

### BƯỚC 4: Đăng nhập và Authorize

1. Google sẽ yêu cầu **đăng nhập** Gmail account của bạn

2. **Chọn Gmail account** bạn muốn dùng để gửi email

3. Google sẽ hiện cảnh báo "Google hasn't verified this app"
   - Click **"Advanced"** (ở dưới)
   - Click **"Go to OAuth Playground (unsafe)"**

4. Google sẽ hỏi quyền truy cập:
   - ✅ Check các quyền cần thiết
   - Click **"Allow"** hoặc **"Continue"**

---

### BƯỚC 5: Exchange Authorization Code

1. Sau khi authorize, bạn sẽ thấy **"Authorization code"** ở màn hình

2. **Click nút "Exchange authorization code for tokens"** (màu xanh)

3. Google sẽ trả về **JSON response** với các tokens:
   ```json
   {
     "access_token": "ya29.a0AfH6SMC...",
     "refresh_token": "1//0gABC123xyz456...",
     "scope": "https://mail.google.com/",
     "token_type": "Bearer",
     "expires_in": 3599
   }
   ```

---

### BƯỚC 6: Copy Refresh Token

1. **Tìm dòng "refresh_token"** trong JSON response

2. **Copy toàn bộ giá trị** của refresh_token (chuỗi dài, bắt đầu bằng `1//0g...`)

3. **⚠️ LƯU NGAY** vào file `.env`:
   ```bash
   GMAIL_REFRESH_TOKEN=1//0gABC123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz
   ```

---

## 📝 VÍ DỤ:

Sau khi exchange tokens, bạn sẽ thấy:

```
Step 2 - Exchange authorization code for tokens

Request:
POST /oauth2/v4/token HTTP/1.1
Host: oauth2.googleapis.com
Content-length: XXX
Content-type: application/x-www-form-urlencoded
...

Response:
{
  "access_token": "ya29.a0AfH6SMC...",
  "refresh_token": "1//0gABC123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz",
  "scope": "https://mail.google.com/",
  "token_type": "Bearer",
  "expires_in": 3599
}
```

➡️ **Copy dòng `"refresh_token"`** (bỏ dấu ngoặc kép):
```
1//0gABC123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz
```

➡️ **Paste vào file `.env`:**
```bash
GMAIL_REFRESH_TOKEN=1//0gABC123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yz
```

---

## ✅ CHECKLIST:

- [ ] Đã có GMAIL_CLIENT_ID và GMAIL_CLIENT_SECRET
- [ ] Đã vào OAuth 2.0 Playground
- [ ] Đã config OAuth credentials trong Settings
- [ ] Đã chọn scope `https://mail.google.com/`
- [ ] Đã click "Authorize APIs"
- [ ] Đã đăng nhập và allow permissions
- [ ] Đã click "Exchange authorization code for tokens"
- [ ] Đã copy refresh_token từ JSON response
- [ ] Đã paste vào file `.env`

---

## 🔍 TROUBLESHOOTING:

### ❌ Lỗi: "Invalid client"
→ Kiểm tra lại GMAIL_CLIENT_ID và GMAIL_CLIENT_SECRET đã đúng chưa

### ❌ Lỗi: "Redirect URI mismatch"
→ Đảm bảo trong Google Cloud Console, OAuth client có redirect URI:
   ```
   https://developers.google.com/oauthplayground
   ```

### ❌ Không thấy refresh_token trong response
→ Có thể bạn đã authorize trước đó. Thử:
   1. Click "Reset" ở OAuth Playground
   2. Làm lại từ đầu
   3. Hoặc revoke access và authorize lại

### ❌ Refresh token chỉ hiện 1 lần
→ Đúng vậy! Refresh token chỉ hiện khi:
   - Lần đầu authorize
   - Hoặc sau khi reset/revoke access
   
   → **Copy ngay** khi thấy!

---

## 💡 TIPS:

1. **Copy ngay** refresh_token khi thấy (chỉ hiện 1 lần!)
2. **Lưu an toàn** trong file `.env` (không commit vào Git)
3. **Refresh token không hết hạn** (trừ khi bạn revoke access)
4. Nếu mất refresh token, làm lại các bước trên

---

## 🎯 TÓM TẮT:

1. Vào https://developers.google.com/oauthplayground
2. Settings → Check "Use your own OAuth credentials" → Nhập Client ID & Secret
3. Chọn scope `https://mail.google.com/`
4. Click "Authorize APIs" → Đăng nhập → Allow
5. Click "Exchange authorization code for tokens"
6. Copy `refresh_token` từ JSON response
7. Paste vào file `.env`:
   ```bash
   GMAIL_REFRESH_TOKEN=1//0gABC123...
   ```

---

## 📸 HÌNH ẢNH MÔ TẢ:

### Màn hình OAuth Playground:
```
┌─────────────────────────────────────┐
│ OAuth 2.0 Playground          ⚙️   │
├─────────────────────────────────────┤
│ Step 1 - Select & authorize APIs  │
│                                     │
│ ☑ Gmail API v1                     │
│   ☑ https://mail.google.com/       │
│                                     │
│ [Authorize APIs]                    │
└─────────────────────────────────────┘
```

### Sau khi authorize:
```
┌─────────────────────────────────────┐
│ Step 2 - Exchange authorization...  │
│                                     │
│ Response:                           │
│ {                                   │
│   "refresh_token": "1//0gABC..."    │
│   ⬆️ COPY CÁI NÀY!                  │
│ }                                   │
└─────────────────────────────────────┘
```

---

**🚀 Sau khi có refresh_token, bạn đã hoàn tất setup OAuth2!**

**💡 Nếu muốn đơn giản hơn, có thể dùng App Password (xem file EMAIL_MODULE_GUIDE.md)**
