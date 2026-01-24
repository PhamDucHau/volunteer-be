# Test Gallery API với cURL

## Base URL
```
http://localhost:3000
```

---

## 1. Gallery Category API

### 1.1. GET - Lấy danh sách gallery categories (có phân trang)
```bash
curl -X GET "http://localhost:3000/gallery-categories?page=1&limit=10" \
  -H "Content-Type: application/json"
```

### 1.2. GET - Lấy tất cả gallery categories (không phân trang)
```bash
curl -X GET "http://localhost:3000/gallery-categories?page=all" \
  -H "Content-Type: application/json"
```

### 1.3. GET - Tìm kiếm gallery categories
```bash
curl -X GET "http://localhost:3000/gallery-categories?page=1&limit=10&search=places" \
  -H "Content-Type: application/json"
```

### 1.4. POST - Tạo mới gallery category
```bash
curl -X POST "http://localhost:3000/gallery-categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "places",
    "description": "Địa điểm du lịch"
  }'
```

### 1.5. POST - Tạo thêm các category mẫu
```bash
# Category "tours"
curl -X POST "http://localhost:3000/gallery-categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "tours",
    "description": "Tour và Tham quan"
  }'

# Category "reviews"
curl -X POST "http://localhost:3000/gallery-categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "reviews",
    "description": "Đánh giá"
  }'
```

### 1.6. PUT - Cập nhật gallery category
```bash
# Thay CATEGORY_ID bằng ID thực tế từ response tạo category
curl -X PUT "http://localhost:3000/gallery-categories/CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "places-updated",
    "description": "Mô tả đã cập nhật"
  }'
```

### 1.7. DELETE - Xóa gallery category (soft delete)
```bash
# Thay CATEGORY_ID bằng ID thực tế
curl -X DELETE "http://localhost:3000/gallery-categories/CATEGORY_ID" \
  -H "Content-Type: application/json"
```

---

## 2. Gallery API

### 2.1. GET - Lấy danh sách gallery items (có phân trang)
```bash
curl -X GET "http://localhost:3000/galleries?page=1&limit=10" \
  -H "Content-Type: application/json"
```

### 2.2. GET - Lấy tất cả gallery items (không phân trang)
```bash
curl -X GET "http://localhost:3000/galleries?page=all" \
  -H "Content-Type: application/json"
```

### 2.3. GET - Tìm kiếm gallery items
```bash
curl -X GET "http://localhost:3000/galleries?page=1&limit=10&search=du lich" \
  -H "Content-Type: application/json"
```

### 2.4. GET - Lọc gallery items theo category
```bash
# Thay CATEGORY_ID bằng ID thực tế từ gallery category
curl -X GET "http://localhost:3000/galleries?page=1&limit=10&category=CATEGORY_ID" \
  -H "Content-Type: application/json"
```

### 2.5. GET - Tìm kiếm và lọc theo category
```bash
curl -X GET "http://localhost:3000/galleries?page=1&limit=10&search=thanh pho&category=CATEGORY_ID" \
  -H "Content-Type: application/json"
```

### 2.6. GET - Lấy gallery item theo ID
```bash
# Thay GALLERY_ID bằng ID thực tế
curl -X GET "http://localhost:3000/galleries/GALLERY_ID" \
  -H "Content-Type: application/json"
```

### 2.7. POST - Tạo mới gallery item
```bash
# Thay CATEGORY_ID bằng ID thực tế từ gallery category (places, tours, hoặc reviews)
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img1.jpg",
    "category": "CATEGORY_ID",
    "title": "Chuyến du lịch mùa hè đến xứ sở mùa đông",
    "description": "Khám phá vẻ đẹp của thiên nhiên trong chuyến đi tuyệt vời",
    "date": "2024-01-15",
    "views": 0
  }'
```

### 2.8. POST - Tạo thêm các gallery items mẫu
```bash
# Gallery item 1
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img2.jpg",
    "category": "CATEGORY_ID",
    "title": "Vẻ đẹp của thiên nhiên Việt Nam",
    "description": "Những cảnh quan tuyệt đẹp của đất nước",
    "date": "2024-01-20",
    "views": 0
  }'

# Gallery item 2
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img3.jpg",
    "category": "CATEGORY_ID",
    "title": "Chuyến đi đến thành phố Hồ Chí Minh",
    "description": "Trải nghiệm văn hóa và ẩm thực địa phương",
    "date": "2024-02-01",
    "views": 0
  }'

# Gallery item 3 - Gặp gỡ ông già Noel
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img4.jpg",
    "category": "CATEGORY_ID",
    "title": "Gặp gỡ ông già Noel",
    "description": "Khoảnh khắc đặc biệt trong mùa Giáng sinh",
    "date": "2023-12-25",
    "views": 0
  }'

# Gallery item 4 - Thiên đường biển đảo
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img10.jpg",
    "category": "CATEGORY_ID",
    "title": "Thiên đường biển đảo",
    "description": "Những bãi biển tuyệt đẹp",
    "date": "2024-01-05",
    "views": 0
  }'

# Gallery item 5 - Tour ẩm thực đường phố
curl -X POST "http://localhost:3000/galleries" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "/images/blog/blog-img11.jpg",
    "category": "CATEGORY_ID",
    "title": "Tour ẩm thực đường phố",
    "description": "Khám phá hương vị đặc trưng",
    "date": "2024-01-18",
    "views": 0
  }'
```

### 2.9. PUT - Cập nhật gallery item
```bash
# Thay GALLERY_ID bằng ID thực tế
curl -X PUT "http://localhost:3000/galleries/GALLERY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tiêu đề đã cập nhật",
    "description": "Mô tả đã cập nhật",
    "views": 100
  }'
```

### 2.10. DELETE - Xóa gallery item (soft delete)
```bash
# Thay GALLERY_ID bằng ID thực tế
curl -X DELETE "http://localhost:3000/galleries/GALLERY_ID" \
  -H "Content-Type: application/json"
```

### 2.11. POST - Tăng lượt xem
```bash
# Thay GALLERY_ID bằng ID thực tế
curl -X POST "http://localhost:3000/galleries/GALLERY_ID/views" \
  -H "Content-Type: application/json"
```

---

## 3. Script test nhanh (bash)

### 3.1. Script test Gallery Category
```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== 1. Lấy danh sách gallery categories ==="
curl -X GET "$BASE_URL/gallery-categories?page=1&limit=10" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 2. Tạo category mới ==="
CATEGORY_RESPONSE=$(curl -s -X POST "$BASE_URL/gallery-categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "places",
    "description": "Địa điểm du lịch"
  }')
echo $CATEGORY_RESPONSE | jq

# Lấy ID từ response (cần cài jq)
CATEGORY_ID=$(echo $CATEGORY_RESPONSE | jq -r '._id')

echo -e "\n=== 3. Cập nhật category ==="
curl -X PUT "$BASE_URL/gallery-categories/$CATEGORY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Mô tả đã cập nhật"
  }' | jq

echo -e "\n=== 4. Xóa category ==="
curl -X DELETE "$BASE_URL/gallery-categories/$CATEGORY_ID" \
  -H "Content-Type: application/json" | jq
```

### 3.2. Script test Gallery
```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

# Lấy category ID đầu tiên (hoặc thay bằng ID cụ thể)
CATEGORY_ID="YOUR_CATEGORY_ID_HERE"

echo "=== 1. Lấy danh sách gallery items ==="
curl -X GET "$BASE_URL/galleries?page=1&limit=10" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 2. Tạo gallery item mới ==="
GALLERY_RESPONSE=$(curl -s -X POST "$BASE_URL/galleries" \
  -H "Content-Type: application/json" \
  -d "{
    \"image\": \"/images/blog/blog-img1.jpg\",
    \"category\": \"$CATEGORY_ID\",
    \"title\": \"Chuyến du lịch mùa hè đến xứ sở mùa đông\",
    \"description\": \"Khám phá vẻ đẹp của thiên nhiên trong chuyến đi tuyệt vời\",
    \"date\": \"2024-01-15\",
    \"views\": 0
  }")
echo $GALLERY_RESPONSE | jq

# Lấy ID từ response
GALLERY_ID=$(echo $GALLERY_RESPONSE | jq -r '._id')

echo -e "\n=== 3. Lấy gallery item theo ID ==="
curl -X GET "$BASE_URL/galleries/$GALLERY_ID" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 4. Tăng lượt xem ==="
curl -X POST "$BASE_URL/galleries/$GALLERY_ID/views" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 5. Cập nhật gallery item ==="
curl -X PUT "$BASE_URL/galleries/$GALLERY_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tiêu đề đã cập nhật",
    "views": 100
  }' | jq

echo -e "\n=== 6. Tìm kiếm gallery items ==="
curl -X GET "$BASE_URL/galleries?search=du lich&page=1&limit=10" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 7. Lọc theo category ==="
curl -X GET "$BASE_URL/galleries?category=$CATEGORY_ID&page=1&limit=10" \
  -H "Content-Type: application/json" | jq

echo -e "\n=== 8. Xóa gallery item ==="
curl -X DELETE "$BASE_URL/galleries/$GALLERY_ID" \
  -H "Content-Type: application/json" | jq
```

---

## 4. Lưu ý khi test

1. **Thứ tự test:**
   - Nên tạo Gallery Categories trước (places, tours, reviews)
   - Lấy ID của categories từ response
   - Dùng các category IDs này để tạo Gallery items

2. **Thay thế IDs:**
   - `CATEGORY_ID`: ID thực tế từ response tạo category
   - `GALLERY_ID`: ID thực tế từ response tạo gallery item

3. **Date format:**
   - Date có thể dùng format ISO: `"2024-01-15"`
   - Hoặc format đầy đủ: `"2024-01-15T00:00:00.000Z"`

4. **Format JSON:**
   - Tất cả requests đều dùng JSON
   - Response sẽ tự động populate thông tin category khi trả về gallery items

5. **Soft Delete:**
   - DELETE chỉ đánh dấu `deleted: true`, không xóa thực sự
   - Các query GET sẽ tự động filter ra các items đã bị xóa

6. **Search:**
   - Search hỗ trợ tiếng Việt có dấu và không dấu
   - Tìm kiếm trong title và description

