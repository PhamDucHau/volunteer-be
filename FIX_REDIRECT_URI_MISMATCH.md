# 🔧 FIX LỖI: redirect_uri_mismatch

## ❌ LỖI BẠN ĐANG GẶP:

```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch
```

## 🔍 NGUYÊN NHÂN:

Redirect URI trong OAuth request **KHÔNG KHỚP** với redirect URI đã cấu hình trong Google Cloud Console.

---

## ✅ CÁCH FIX (3 BƯỚC):

### BƯỚC 1: Vào Google Cloud Console

1. Truy cập: **https://console.cloud.google.com/**
2. Chọn **project** của bạn
3. Vào **"APIs & Services"** > **"Credentials"**

---

### BƯỚC 2: Tìm và Sửa OAuth Client

1. Tìm **OAuth 2.0 Client ID** bạn đã tạo (có Client ID và Client Secret)

2. **Click vào tên** của OAuth client để **edit**

3. Tìm phần **"Authorized redirect URIs"**

4. **KIỂM TRA** xem có dòng này chưa:
   ```
   https://developers.google.com/oauthplayground
   ```

5. **NẾU CHƯA CÓ:**
   - Click **"+ ADD URI"**
   - Paste chính xác: `https://developers.google.com/oauthplayground`
   - ⚠️ **QUAN TRỌNG:** 
     - Phải là `https://` (không phải `http://`)
     - Không có dấu `/` ở cuối
     - Phải chính xác 100%

6. **Click "SAVE"** (ở dưới cùng)

---

### BƯỚC 3: Thử lại OAuth Playground

1. Vào lại: **https://developers.google.com/oauthplayground**

2. **Click "Reset"** (nếu có) để clear cache

3. Làm lại các bước:
   - Settings → Config OAuth credentials
   - Chọn scope `https://mail.google.com/`
   - Click "Authorize APIs"

4. **Lần này sẽ không còn lỗi!** ✅

---

## 📝 VÍ DỤ CẤU HÌNH ĐÚNG:

Trong Google Cloud Console, phần **"Authorized redirect URIs"** phải có:

```
Authorized redirect URIs
┌─────────────────────────────────────────────┐
│ https://developers.google.com/oauthplayground │
└─────────────────────────────────────────────┘
```

**KHÔNG ĐƯỢC:**
- ❌ `http://developers.google.com/oauthplayground` (thiếu s)
- ❌ `https://developers.google.com/oauthplayground/` (có dấu / cuối)
- ❌ `https://oauthplayground.google.com` (sai domain)
- ❌ Bất kỳ URI nào khác

**PHẢI CHÍNH XÁC:**
- ✅ `https://developers.google.com/oauthplayground`

---

## 🔍 KIỂM TRA CHI TIẾT:

### Trong Google Cloud Console:

1. **APIs & Services** > **Credentials**
2. Click vào **OAuth 2.0 Client ID** của bạn
3. Scroll xuống phần **"Authorized redirect URIs"**
4. Phải thấy:
   ```
   https://developers.google.com/oauthplayground
   ```

### Trong OAuth Playground:

1. Mở **Settings** (⚙️)
2. Check **"Use your own OAuth credentials"**
3. Nhập **Client ID** và **Client Secret**
4. **KHÔNG CẦN** nhập redirect URI ở đây (OAuth Playground tự động dùng đúng URI)

---

## ⚠️ LƯU Ý QUAN TRỌNG:

1. **Sau khi thêm redirect URI**, phải **SAVE** trong Google Cloud Console
2. Có thể mất **1-2 phút** để Google cập nhật
3. Nếu vẫn lỗi, thử **clear cache** browser hoặc **incognito mode**
4. Đảm bảo **không có typo** trong redirect URI

---

## 🎯 CHECKLIST FIX LỖI:

- [ ] Đã vào Google Cloud Console
- [ ] Đã tìm OAuth 2.0 Client ID
- [ ] Đã click vào để edit
- [ ] Đã kiểm tra "Authorized redirect URIs"
- [ ] Đã thêm `https://developers.google.com/oauthplayground` (nếu chưa có)
- [ ] Đã click SAVE
- [ ] Đã đợi 1-2 phút
- [ ] Đã thử lại OAuth Playground
- [ ] Đã click Reset trong OAuth Playground (nếu cần)
- [ ] Lỗi đã biến mất! ✅

---

## 🔄 NẾU VẪN LỖI:

### Thử các cách sau:

1. **Tạo OAuth Client mới:**
   - Xóa OAuth client cũ
   - Tạo mới với redirect URI đúng ngay từ đầu

2. **Kiểm tra lại từng ký tự:**
   ```
   https://developers.google.com/oauthplayground
   ```
   - Không có space
   - Không có trailing slash
   - Đúng chữ hoa/thường

3. **Thử browser khác** hoặc **incognito mode**

4. **Đợi thêm vài phút** (Google có thể cache)

---

## 💡 TIP:

**Cách nhanh nhất:**
1. Copy chính xác dòng này: `https://developers.google.com/oauthplayground`
2. Paste vào "Authorized redirect URIs" trong Google Cloud Console
3. Save
4. Đợi 1 phút
5. Thử lại!

---

## ✅ SAU KHI FIX:

Sau khi fix xong, bạn sẽ có thể:
1. ✅ Authorize thành công trong OAuth Playground
2. ✅ Lấy được `GMAIL_REFRESH_TOKEN`
3. ✅ Gửi email thành công!

---

**🚀 Fix xong lỗi này, tiếp tục lấy refresh token theo hướng dẫn trong `HOW_TO_GET_REFRESH_TOKEN.md`!**
