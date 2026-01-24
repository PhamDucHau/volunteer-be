#!/bin/bash

# ============================================
# QUICK TEST CURL COMMANDS
# Thay YOUR_EMAIL bằng email thật của bạn
# ============================================

EMAIL="YOUR_EMAIL@gmail.com"
BASE_URL="http://localhost:3001"

echo "🚀 Testing Email Module"
echo "📧 Email: $EMAIL"
echo ""

# Nếu truyền tham số email
if [ ! -z "$1" ]; then
  EMAIL=$1
fi

# ============================================
# 1. TEST SIMPLE EMAIL
# ============================================
echo "📨 1. Testing Simple Email..."
curl -X POST $BASE_URL/email/send \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$EMAIL\",
    \"subject\": \"Test Email từ Volunteer System\",
    \"html\": \"<h1 style='color: #4CAF50;'>✅ Success!</h1><p>Email module hoạt động tốt!</p>\",
    \"text\": \"Success! Email module hoạt động tốt!\"
  }"

echo -e "\n\n"

# ============================================
# 2. TEST WELCOME EMAIL
# ============================================
echo "📨 2. Testing Welcome Email..."
curl -X POST $BASE_URL/email/send-welcome \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$EMAIL\",
    \"userName\": \"Nguyễn Văn Test\"
  }"

echo -e "\n\n"

# ============================================
# 3. TEST PASSWORD RESET
# ============================================
echo "📨 3. Testing Password Reset Email..."
curl -X POST $BASE_URL/email/send-password-reset \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$EMAIL\",
    \"resetToken\": \"test-token-abc123\"
  }"

echo -e "\n\n"

# ============================================
# 4. TEST DONATION CONFIRMATION
# ============================================
echo "📨 4. Testing Donation Confirmation Email..."
curl -X POST $BASE_URL/email/send-donation-confirmation \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$EMAIL\",
    \"userName\": \"Trần Thị Donor\",
    \"donationDetails\": {
      \"campaignName\": \"Chiến dịch Mùa Đông Ấm 2026\",
      \"items\": \"10 áo khoác, 5 chăn ấm\",
      \"date\": \"$(date '+%Y-%m-%d')\"
    }
  }"

echo -e "\n\n✅ All tests sent! Check your email: $EMAIL"
