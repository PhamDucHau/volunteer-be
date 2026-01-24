# 🔧 FIX LỖI: Error 403 - access_denied

## ❌ LỖI BẠN ĐANG GẶP:

```
Access blocked: sent-gmail-volunteer has not completed the Google verification process
Error 403: access_denied

The app is currently being tested, and can only be accessed by developer-approved testers.
```

## 🔍 NGUYÊN NHÂN:

App của bạn đang ở chế độ **"Testing"** trong Google Cloud Console, và email `phaucau2311@gmail.com` **chưa được thêm vào danh sách Test Users**.

---

## ✅ CÁCH FIX (2 PHƯƠNG ÁN):

### 🎯 PHƯƠNG ÁN 1: Thêm Test User (NHANH NHẤT - Khuyên dùng)

#### Bước 1: Vào OAuth Consent Screen

1. Truy cập: **https://console.cloud.google.com/**
2. Chọn **project** của bạn (sent-gmail-volunteer)
3. Vào **"APIs & Services"** > **"OAuth consent screen"**

#### Bước 2: Thêm Test User

1. Scroll xuống phần **"Test users"**

2. Click nút **"+ ADD USERS"** (màu xanh)

3. **Nhập email** của bạn:
   ```
   phaucau2311@gmail.com
   ```

4. Click **"ADD"**

5. **Lưu ý:** Có thể thêm nhiều test users (mỗi dòng 1 email)

6. Click **"SAVE"** (nếu có)

#### Bước 3: Thử lại

1. Đợi **1-2 phút** để Google cập nhật

2. Vào lại **OAuth Playground**

3. Thử **authorize lại**

4. **Lần này sẽ thành công!** ✅

---

### 🎯 PHƯƠNG ÁN 2: Publish App (Cho Production)

**⚠️ CHỈ DÙNG NẾU:**
- Bạn muốn app công khai cho mọi người
- Bạn đã sẵn sàng publish app

**KHÔNG KHUYÊN DÙNG** cho development/testing vì:
- Cần verification process phức tạp
- Mất thời gian
- Không cần thiết cho mục đích test

---

## 📝 HƯỚNG DẪN CHI TIẾT - PHƯƠNG ÁN 1:

### Bước 1: Vào Google Cloud Console

1. Mở: **https://console.cloud.google.com/**

2. **Chọn project** `sent-gmail-volunteer` (hoặc project bạn đang dùng)

3. Ở menu bên trái, click **"APIs & Services"**

4. Click **"OAuth consent screen"**

### Bước 2: Tìm phần Test Users

1. Scroll xuống trang

2. Tìm phần **"Test users"** (có thể ở cuối trang)

3. Bạn sẽ thấy:
   ```
   Test users
   ┌─────────────────────────────────────┐
   │ Users added here can access your app │
   │ while it's in testing mode.         │
   │                                     │
   │ [+ ADD USERS]                       │
   └─────────────────────────────────────┘
   ```

### Bước 3: Thêm Email của Bạn

1. Click nút **"+ ADD USERS"**

2. Một popup sẽ hiện ra

3. **Nhập email** của bạn:
   ```
   phaucau2311@gmail.com
   ```

4. **Lưu ý:**
   - Có thể thêm nhiều email (mỗi dòng 1 email)
   - Email phải là Gmail hoặc Google Workspace
   - Email phải chính xác 100%

5. Click **"ADD"**

6. Email sẽ xuất hiện trong danh sách Test Users

### Bước 4: Save và Đợi

1. Nếu có nút **"SAVE"**, click nó

2. **Đợi 1-2 phút** để Google cập nhật

3. Có thể refresh trang để kiểm tra email đã được thêm chưa

### Bước 5: Thử lại OAuth

1. Vào lại: **https://developers.google.com/oauthplayground**

2. **Click "Reset"** (nếu có) để clear cache

3. Làm lại các bước:
   - Settings → Config OAuth credentials
   - Chọn scope `https://mail.google.com/`
   - Click "Authorize APIs"

4. **Lần này sẽ không còn lỗi 403!** ✅

---

## ✅ CHECKLIST:

- [ ] Đã vào Google Cloud Console
- [ ] Đã chọn đúng project (sent-gmail-volunteer)
- [ ] Đã vào "APIs & Services" > "OAuth consent screen"
- [ ] Đã scroll xuống phần "Test users"
- [ ] Đã click "+ ADD USERS"
- [ ] Đã nhập email: `phaucau2311@gmail.com`
- [ ] Đã click "ADD"
- [ ] Đã click "SAVE" (nếu có)
- [ ] Đã đợi 1-2 phút
- [ ] Đã thử lại OAuth Playground
- [ ] Lỗi 403 đã biến mất! ✅

---

## 🔍 KIỂM TRA SAU KHI THÊM:

Sau khi thêm test user, trong OAuth consent screen, phần "Test users" sẽ hiển thị:

```
Test users
┌─────────────────────────────────────┐
│ phaucau2311@gmail.com               │
│                                     │
│ [+ ADD USERS]                       │
└─────────────────────────────────────┘
```

---

## ⚠️ LƯU Ý QUAN TRỌNG:

1. **Chỉ thêm email Gmail** hoặc Google Workspace
2. **Email phải chính xác** (không có typo)
3. **Có thể thêm nhiều test users** (mỗi dòng 1 email)
4. **Sau khi thêm, đợi 1-2 phút** trước khi thử lại
5. **Nếu vẫn lỗi**, kiểm tra lại:
   - Email đã được thêm chưa?
   - Đã save chưa?
   - Đã đợi đủ thời gian chưa?

---

## 💡 TIPS:

### Thêm nhiều Test Users:

Nếu bạn muốn thêm nhiều email để test:

```
phaucau2311@gmail.com
test1@gmail.com
test2@gmail.com
```

Mỗi email trên 1 dòng trong popup "ADD USERS".

### Xóa Test User:

Nếu muốn xóa test user:
1. Vào OAuth consent screen
2. Tìm email trong danh sách Test Users
3. Click icon **🗑️ (Delete)** bên cạnh email
4. Confirm delete

---

## 🎯 TÓM TẮT:

1. Vào **Google Cloud Console** > **OAuth consent screen**
2. Scroll xuống phần **"Test users"**
3. Click **"+ ADD USERS"**
4. Nhập email: `phaucau2311@gmail.com`
5. Click **"ADD"**
6. Đợi **1-2 phút**
7. Thử lại **OAuth Playground**
8. **Thành công!** ✅

---

## 🔄 NẾU VẪN LỖI:

### Kiểm tra lại:

1. **Email đã được thêm chưa?**
   - Vào OAuth consent screen
   - Kiểm tra danh sách Test Users
   - Phải thấy email của bạn

2. **Đã đợi đủ thời gian chưa?**
   - Đợi ít nhất 2 phút
   - Refresh trang OAuth consent screen

3. **Email có đúng không?**
   - Kiểm tra lại email: `phaucau2311@gmail.com`
   - Không có space, không có typo

4. **Đã clear cache chưa?**
   - Thử incognito mode
   - Hoặc clear browser cache

---

## ✅ SAU KHI FIX:

Sau khi fix xong, bạn sẽ có thể:
1. ✅ Authorize thành công trong OAuth Playground
2. ✅ Không còn lỗi 403
3. ✅ Lấy được `GMAIL_REFRESH_TOKEN`
4. ✅ Gửi email thành công!

---

**🚀 Fix xong lỗi này, tiếp tục lấy refresh token theo hướng dẫn trong `HOW_TO_GET_REFRESH_TOKEN.md`!**
