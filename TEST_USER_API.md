# Các lệnh curl để test User API

## 1. Đăng nhập để lấy token (hoặc sử dụng token có sẵn)

```bash
# Đăng nhập
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "phaucau2311@gmail.com",
    "password": "your_password"
  }'

# Response sẽ có dạng:
# {
#   "user": { ... },
#   "token": {
#     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
#   }
# }

# Lưu token vào biến TOKEN (lấy từ token.accessToken)
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Hoặc nếu dùng jq:
export TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "phaucau2311@gmail.com", "password": "your_password"}' \
  | jq -r '.token.accessToken')

echo "Token: $TOKEN"
```

**LƯU Ý QUAN TRỌNG:**
- Token có thời hạn 1 giờ, sau đó cần đăng nhập lại
- Header Authorization phải có format: `Authorization: Bearer <token>`
- Không có khoảng trắng thừa trong token
- Token phải là giá trị từ `token.accessToken` trong response, không phải toàn bộ object

## 2. Lấy danh sách users (có phân trang)

```bash
# Lấy trang đầu tiên, 10 users mỗi trang
curl -X GET "http://localhost:3000/users?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Lấy tất cả users (không phân trang)
curl -X GET "http://localhost:3000/users?page=all" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Tìm kiếm user theo tên hoặc email
curl -X GET "http://localhost:3000/users?search=Hau&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Lọc theo role
curl -X GET "http://localhost:3000/users?role=694440447fe786abf5ec226f&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Kết hợp search và role
curl -X GET "http://localhost:3000/users?search=Hau&role=694440447fe786abf5ec226f&page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 3. Lấy thông tin user theo ID

```bash
curl -X GET "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 4. Tạo user mới

```bash
# Tạo user với đầy đủ thông tin
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "password": "password123",
    "role": "694440447fe786abf5ec226f",
    "securityConfirmed": true
  }'

# Tạo user với Firebase UID (không cần password)
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trần Thị B",
    "email": "tranthib@example.com",
    "uid": "firebase_uid_123",
    "role": "694440447fe786abf5ec226f",
    "securityConfirmed": false
  }'
```

## 5. Cập nhật user

```bash
# Cập nhật tên và email
curl -X PUT "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hậu Phạm Đức Updated",
    "email": "newemail@example.com"
  }'

# Cập nhật password
curl -X PUT "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'

# Cập nhật role
curl -X PUT "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "694440447fe786abf5ec226f"
  }'

# Cập nhật securityConfirmed
curl -X PUT "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "securityConfirmed": true
  }'
```

## 6. Xóa user

```bash
curl -X DELETE "http://localhost:3000/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 7. Lấy danh sách roles (trong module user)

```bash
# Lấy tất cả roles từ user module
curl -X GET http://localhost:3000/users/roles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Hoặc từ auth module (endpoint cũ vẫn hoạt động)
curl -X GET http://localhost:3000/auth/role \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## 8. Kiểm tra trạng thái securityConfirmed của user hiện tại

```bash
# Check securityConfirmed status
curl -X GET http://localhost:3000/users/me/security-status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Response:
# {
#   "message": "Trạng thái xác thực bảo mật",
#   "data": {
#     "email": "user@example.com",
#     "name": "User Name",
#     "securityConfirmed": false,
#     "requiresVerification": true  // true nếu securityConfirmed = false
#   }
# }
```

## 9. Cập nhật securityConfirmed

```bash
# Bật securityConfirmed (false -> true)
curl -X PUT http://localhost:3000/users/me/security-confirm \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "securityConfirmed": true
  }'

# Tắt securityConfirmed (true -> false)
curl -X PUT http://localhost:3000/users/me/security-confirm \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "securityConfirmed": false
  }'
```

**Lưu ý về flow:**
- Nếu `securityConfirmed = true`: User không cần xác thực thêm, có thể thực hiện các thao tác ngay
- Nếu `securityConfirmed = false`: Frontend sẽ yêu cầu user xác thực thêm (nhập password) trước khi cho phép thực hiện các thao tác quan trọng
- Cập nhật `securityConfirmed` không cần verify password, có thể bật/tắt trực tiếp

## Script test nhanh (bash)

```bash
#!/bin/bash

# Set token
TOKEN="your_token_here"
BASE_URL="http://localhost:3000"

echo "=== 1. Lấy danh sách users ==="
curl -X GET "$BASE_URL/users?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 2. Tìm kiếm user ==="
curl -X GET "$BASE_URL/users?search=Hau&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 3. Tạo user mới ==="
curl -X POST "$BASE_URL/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "test123",
    "securityConfirmed": true
  }' | jq

echo -e "\n=== 4. Lấy user theo ID ==="
curl -X GET "$BASE_URL/users/69444176d6cb417e5daee433" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq
```

## Lưu ý:

1. Thay `$TOKEN` bằng token thực tế từ response đăng nhập
2. Thay các ID (user ID, role ID) bằng ID thực tế từ database
3. Port mặc định là 3000, thay đổi nếu server chạy port khác
4. Tất cả endpoint đều yêu cầu Authorization header với Bearer token
5. Response sẽ tự động populate thông tin role khi trả về user

