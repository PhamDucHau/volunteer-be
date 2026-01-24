# 🔑 CÁCH LẤY GMAIL_CLIENT_SECRET

## ⚠️ QUAN TRỌNG:
**`GMAIL_CLIENT_SECRET` KHÔNG PHẢI TỰ ĐẶT!**  
Nó được **Google tự động tạo** khi bạn tạo OAuth Client ID. Bạn chỉ cần **copy** nó về!

---

## 📍 VỊ TRÍ LẤY GMAIL_CLIENT_SECRET:

### Bước 1: Vào Google Cloud Console
👉 https://console.cloud.google.com/

### Bước 2: Chọn Project
- Chọn project của bạn hoặc tạo project mới

### Bước 3: Enable Gmail API
1. Vào menu **"APIs & Services"** (☰ góc trái)
2. Click **"Library"**
3. Tìm **"Gmail API"**
4. Click **"Enable"**

### Bước 4: Tạo OAuth Credentials (Nơi lấy Client Secret)

1. Vào **"APIs & Services"** > **"Credentials"**

2. Click nút **"+ CREATE CREDENTIALS"** (màu xanh)

3. Chọn **"OAuth client ID"**

4. **Nếu lần đầu**, Google sẽ yêu cầu tạo OAuth consent screen:
   - Click **"CONFIGURE CONSENT SCREEN"**
   - Chọn **"External"** > Click **"CREATE"**
   - Điền thông tin:
     - **App name**: `Volunteer System`
     - **User support email**: Email của bạn
     - **Developer contact information**: Email của bạn
   - Click **"SAVE AND CONTINUE"** (3 lần để skip các bước khác)
   - Click **"BACK TO DASHBOARD"**

5. Quay lại **"Credentials"** > Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**

6. Chọn **Application type**: **"Web application"**

7. Đặt tên (ví dụ: `Gmail OAuth Client`)

8. **Authorized redirect URIs**: Thêm dòng này:
   ```
   https://developers.google.com/oauthplayground
   ```

9. Click **"CREATE"**

10. **🎯 ĐÂY LÀ NƠI BẠN LẤY CREDENTIALS:**
    
    Google sẽ hiện popup với 2 thông tin:
    
    ```
    Your Client ID
    123456789-abcdefghijk.apps.googleusercontent.com
    ⬆️ Đây là GMAIL_CLIENT_ID
    
    Your Client Secret
    GOCSPX-abc123xyz456...
    ⬆️ Đây là GMAIL_CLIENT_SECRET
    ```
    
    **⚠️ QUAN TRỌNG:** 
    - Click nút **"COPY"** để copy Client Secret
    - **Lưu ngay** vì Google chỉ hiện 1 lần!
    - Nếu quên, phải tạo OAuth client mới

---

## 📝 VÍ DỤ:

Sau khi tạo OAuth client, bạn sẽ thấy:

```
✅ OAuth client created

Your Client ID
123456789-abcdefghijk.apps.googleusercontent.com

Your Client Secret  
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45mno678pqr901stu234vwx567yz
```

➡️ **Copy 2 dòng này** và paste vào file `.env`:

```bash
# File .env
GMAIL_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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45mno678pqr901stu234vwx567yz
```

---

## 🔍 NẾU QUÊN CLIENT SECRET:

Nếu bạn đã tạo OAuth client nhưng quên copy Client Secret:

### Cách 1: Xem lại trong Google Cloud Console
1. Vào **"APIs & Services"** > **"Credentials"**
2. Tìm OAuth client bạn vừa tạo
3. Click vào icon **👁️ (Show)** bên cạnh Client Secret
4. Nhập password Google account để xem

### Cách 2: Tạo OAuth client mới
1. Xóa OAuth client cũ (nếu cần)
2. Tạo lại theo các bước trên
3. **Nhớ copy Client Secret ngay lần này!**

---

## ✅ CHECKLIST:

- [ ] Đã vào Google Cloud Console
- [ ] Đã tạo project (hoặc chọn project có sẵn)
- [ ] Đã enable Gmail API
- [ ] Đã tạo OAuth consent screen
- [ ] Đã tạo OAuth client ID (Web application)
- [ ] Đã thêm redirect URI: `https://developers.google.com/oauthplayground`
- [ ] **Đã copy Client ID** ✅
- [ ] **Đã copy Client Secret** ✅
- [ ] Đã paste vào file `.env`

---

## 🎯 TÓM TẮT:

1. **GMAIL_CLIENT_SECRET** = Google tự động tạo
2. **KHÔNG** tự đặt được
3. **Lấy từ** Google Cloud Console > Credentials > OAuth client
4. **Copy ngay** khi Google hiện ra (chỉ hiện 1 lần!)
5. **Paste vào** file `.env` của bạn

---

## 💡 TIP:

Sau khi copy Client Secret, **paste ngay vào file `.env`** để không bị mất!

```bash
# Mở file .env
nano .env
# hoặc
code .env
```

Paste ngay:
```bash
GMAIL_CLIENT_SECRET=GOCSPX-abc123xyz456...
```

---

**🚀 Sau khi có Client ID và Client Secret, tiếp tục lấy Refresh Token theo hướng dẫn trong `EMAIL_MODULE_GUIDE.md`!**
