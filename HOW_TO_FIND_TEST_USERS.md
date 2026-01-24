# 🔍 CÁCH TÌM VÀ THÊM TEST USERS

## 📍 BẠN ĐANG Ở ĐÂU:

Bạn đang ở trang **"OAuth Overview"** (tab "Overview" được chọn).

**Test users KHÔNG nằm ở đây!** Bạn cần chuyển sang tab khác.

---

## ✅ CÁCH TÌM TEST USERS (2 CÁCH):

### 🎯 CÁCH 1: Vào OAuth Consent Screen (KHUYÊN DÙNG)

#### Bước 1: Vào OAuth Consent Screen

1. Từ trang hiện tại, **click vào menu ☰ (hamburger menu)** ở góc trên bên trái

2. Hoặc scroll lên trên, tìm menu **"APIs & Services"**

3. Click **"APIs & Services"** > **"OAuth consent screen"**

   **HOẶC** trực tiếp vào:
   ```
   https://console.cloud.google.com/apis/credentials/consent
   ```

#### Bước 2: Tìm phần Test Users

1. Trong trang **"OAuth consent screen"**, scroll xuống

2. Tìm phần **"Test users"** (thường ở cuối trang, sau phần "Scopes")

3. Bạn sẽ thấy:
   ```
   Test users
   ┌─────────────────────────────────────┐
   │ Users added here can access your app │
   │ while it's in testing mode.          │
   │                                     │
   │ [+ ADD USERS]                       │
   └─────────────────────────────────────┘
   ```

4. Nếu chưa có test user nào, danh sách sẽ trống

5. Click **"+ ADD USERS"** để thêm

---

### 🎯 CÁCH 2: Từ Tab "Audience" (Nếu có)

1. Ở **sidebar bên trái**, tìm tab **"Audience"**

2. Click vào **"Audience"**

3. Scroll xuống tìm phần **"Test users"**

4. Click **"+ ADD USERS"**

---

## 📝 HƯỚNG DẪN CHI TIẾT - CÁCH 1:

### Bước 1: Điều hướng đến OAuth Consent Screen

**Cách A: Từ menu**
1. Click menu **☰** (góc trên bên trái)
2. Tìm **"APIs & Services"**
3. Click **"OAuth consent screen"**

**Cách B: Từ URL trực tiếp**
1. Copy URL này:
   ```
   https://console.cloud.google.com/apis/credentials/consent?project=sent-gmail-volunteer
   ```
2. Paste vào browser và Enter

**Cách C: Từ sidebar hiện tại**
1. Ở sidebar bên trái, bạn thấy các tab:
   - Overview ← Bạn đang ở đây
   - Branding
   - Audience
   - Clients
   - Data Access
   - Verification Center
   - Settings

2. **KHÔNG** click vào các tab này (chúng là của Google Auth Platform)

3. Thay vào đó, **click vào "APIs & Services"** ở menu chính (☰)

---

### Bước 2: Tìm Test Users trong OAuth Consent Screen

1. Sau khi vào **"OAuth consent screen"**, bạn sẽ thấy các tab:
   - Publishing status
   - App information
   - App domain
   - Authorized domains
   - Developer contact information
   - **Scopes**
   - **Test users** ← ĐÂY LÀ NƠI BẠN CẦN!

2. **Scroll xuống** đến phần **"Test users"**

3. Nếu chưa có test user nào, bạn sẽ thấy:
   ```
   Test users
   
   Users added here can access your app while it's in testing mode.
   
   [+ ADD USERS]
   ```

4. Nếu đã có test users, bạn sẽ thấy danh sách:
   ```
   Test users
   
   ┌─────────────────────────────────────┐
   │ phaucau2311@gmail.com               │
   │                                     │
   │ [+ ADD USERS]                       │
   └─────────────────────────────────────┘
   ```

---

### Bước 3: Thêm Test User

1. Click nút **"+ ADD USERS"**

2. Một popup/dialog sẽ hiện ra

3. **Nhập email** của bạn:
   ```
   phaucau2311@gmail.com
   ```

4. **Lưu ý:**
   - Có thể thêm nhiều email (mỗi dòng 1 email)
   - Email phải là Gmail hoặc Google Workspace
   - Email phải chính xác 100%

5. Click **"ADD"** hoặc **"SAVE"**

6. Email sẽ xuất hiện trong danh sách Test Users

---

## 🔍 NẾU VẪN KHÔNG THẤY "Test users":

### Kiểm tra:

1. **Bạn có đang ở đúng trang không?**
   - URL phải có: `/apis/credentials/consent`
   - Không phải: `/apis/credentials/oauth`

2. **App có đang ở chế độ Testing không?**
   - Ở đầu trang "OAuth consent screen", bạn sẽ thấy:
     ```
     Publishing status: Testing
     ```
   - Nếu thấy "In production", test users không cần thiết

3. **Scroll xuống đủ chưa?**
   - Test users thường ở **cuối trang**
   - Scroll xuống hết, sau phần "Scopes"

4. **Thử refresh trang:**
   - F5 hoặc Cmd+R
   - Hoặc reload lại từ đầu

---

## 📸 MÔ TẢ VỊ TRÍ:

```
Google Cloud Console
├── ☰ Menu
│   └── APIs & Services
│       └── OAuth consent screen  ← VÀO ĐÂY!
│           ├── Publishing status
│           ├── App information
│           ├── Scopes
│           └── Test users  ← TÌM Ở ĐÂY!
│               └── [+ ADD USERS]
```

---

## ✅ CHECKLIST:

- [ ] Đã click menu ☰ (hamburger menu)
- [ ] Đã vào "APIs & Services"
- [ ] Đã click "OAuth consent screen"
- [ ] Đã scroll xuống cuối trang
- [ ] Đã tìm thấy phần "Test users"
- [ ] Đã click "+ ADD USERS"
- [ ] Đã nhập email: `phaucau2311@gmail.com`
- [ ] Đã click "ADD"
- [ ] Email đã xuất hiện trong danh sách

---

## 🎯 URL TRỰC TIẾP:

Nếu vẫn không tìm thấy, dùng URL này:

```
https://console.cloud.google.com/apis/credentials/consent?project=sent-gmail-volunteer
```

Thay `sent-gmail-volunteer` bằng project ID của bạn nếu khác.

---

## 💡 TIP:

**Cách nhanh nhất:**
1. Copy URL: `https://console.cloud.google.com/apis/credentials/consent`
2. Paste vào browser
3. Chọn project `sent-gmail-volunteer`
4. Scroll xuống tìm "Test users"
5. Click "+ ADD USERS"

---

## 🔄 NẾU VẪN KHÔNG THẤY:

### Thử các cách sau:

1. **Kiểm tra User Type:**
   - Trong OAuth consent screen, phần "User Type"
   - Phải là **"External"** (không phải "Internal")
   - Nếu là "Internal", chỉ dùng cho Google Workspace

2. **Kiểm tra Publishing Status:**
   - Phải là **"Testing"**
   - Nếu là "In production", không cần test users

3. **Thử browser khác:**
   - Chrome
   - Firefox
   - Safari

4. **Clear cache:**
   - Hard refresh: Cmd+Shift+R (Mac) hoặc Ctrl+Shift+R (Windows)

---

## ✅ SAU KHI TÌM THẤY VÀ THÊM:

Sau khi thêm test user thành công:
1. ✅ Email sẽ xuất hiện trong danh sách
2. ✅ Đợi 1-2 phút
3. ✅ Thử lại OAuth Playground
4. ✅ Lỗi 403 sẽ biến mất!

---

**🚀 Tìm thấy Test users rồi? Thêm email của bạn vào và tiếp tục lấy refresh token!**
