#!/bin/bash

# Email Module Test Script
# Usage: ./test-email.sh [test-type] [your-email]

BASE_URL="http://localhost:3001"
EMAIL=${2:-"test@gmail.com"}

echo "🚀 Testing Email Module"
echo "📧 Target Email: $EMAIL"
echo "🌐 Base URL: $BASE_URL"
echo ""

case $1 in
  "simple")
    echo "📨 Test 1: Simple Email"
    curl -X POST $BASE_URL/email/send \
      -H "Content-Type: application/json" \
      -d "{
        \"to\": \"$EMAIL\",
        \"subject\": \"Test Email - Simple\",
        \"html\": \"<h1 style='color: #4CAF50;'>Test Successful!</h1><p>This is a simple test email.</p>\",
        \"text\": \"Test Successful! This is a simple test email.\"
      }"
    ;;

  "welcome")
    echo "📨 Test 2: Welcome Email"
    curl -X POST $BASE_URL/email/send-welcome \
      -H "Content-Type: application/json" \
      -d "{
        \"to\": \"$EMAIL\",
        \"userName\": \"Test User\"
      }"
    ;;

  "reset")
    echo "📨 Test 3: Password Reset Email"
    curl -X POST $BASE_URL/email/send-password-reset \
      -H "Content-Type: application/json" \
      -d "{
        \"to\": \"$EMAIL\",
        \"resetToken\": \"test-token-12345\"
      }"
    ;;

  "donation")
    echo "📨 Test 4: Donation Confirmation Email"
    curl -X POST $BASE_URL/email/send-donation-confirmation \
      -H "Content-Type: application/json" \
      -d "{
        \"to\": \"$EMAIL\",
        \"userName\": \"Generous Donor\",
        \"donationDetails\": {
          \"campaignName\": \"Winter Clothing Drive 2026\",
          \"items\": \"10 winter jackets, 5 blankets, 20 pairs of gloves\",
          \"date\": \"$(date '+%Y-%m-%d')\"
        }
      }"
    ;;

  "multiple")
    echo "📨 Test 5: Email with Multiple Recipients"
    curl -X POST $BASE_URL/email/send \
      -H "Content-Type: application/json" \
      -d "{
        \"to\": [\"$EMAIL\"],
        \"cc\": [\"cc@example.com\"],
        \"subject\": \"Test Email - Multiple Recipients\",
        \"html\": \"<h2>Multiple Recipients Test</h2><p>This email has CC recipients.</p>\"
      }"
    ;;

  "all")
    echo "🧪 Running ALL Tests..."
    echo ""
    
    echo "1️⃣ Simple Email Test"
    bash $0 simple $EMAIL
    echo ""
    echo "---"
    echo ""
    
    sleep 2
    
    echo "2️⃣ Welcome Email Test"
    bash $0 welcome $EMAIL
    echo ""
    echo "---"
    echo ""
    
    sleep 2
    
    echo "3️⃣ Password Reset Test"
    bash $0 reset $EMAIL
    echo ""
    echo "---"
    echo ""
    
    sleep 2
    
    echo "4️⃣ Donation Confirmation Test"
    bash $0 donation $EMAIL
    echo ""
    echo "---"
    echo ""
    
    echo "✅ All tests completed!"
    ;;

  *)
    echo "Usage: $0 [test-type] [email]"
    echo ""
    echo "Test types:"
    echo "  simple      - Send a simple test email"
    echo "  welcome     - Send welcome email template"
    echo "  reset       - Send password reset email"
    echo "  donation    - Send donation confirmation email"
    echo "  multiple    - Send email with multiple recipients"
    echo "  all         - Run all tests"
    echo ""
    echo "Example:"
    echo "  $0 simple your-email@gmail.com"
    echo "  $0 all your-email@gmail.com"
    exit 1
    ;;
esac

echo ""
echo "✅ Test completed!"
