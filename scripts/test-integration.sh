#!/bin/bash

# MultiStore Admin Dashboard Integration Test Script

API_URL="http://localhost:4000/api"
STRAPI_URL="http://localhost:1337/api"
DASHBOARD_URL="http://localhost:3000"
SOCKET_URL="http://localhost:4000"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  exit 1
}

pass() {
  echo -e "${GREEN}[PASS]${NC} $1"
}

info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

# 1. Check services
info "Checking if MultiStore Backend is running..."
curl -s $API_URL/health | grep 'ok' > /dev/null || fail "MultiStore Backend not running on $API_URL"
pass "MultiStore Backend is running"

info "Checking if Strapi CMS is running..."
curl -s $STRAPI_URL | grep 'data' > /dev/null || fail "Strapi CMS not running on $STRAPI_URL"
pass "Strapi CMS is running"

info "Checking if Admin Dashboard is running..."
curl -s $DASHBOARD_URL | grep '<!DOCTYPE html>' > /dev/null || fail "Admin Dashboard not running on $DASHBOARD_URL"
pass "Admin Dashboard is running"

# 2. Test login endpoint
info "Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}')
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  fail "Login failed. Check credentials and backend auth."
else
  pass "Login endpoint works"
fi

# 3. Test product endpoint (Strapi)
info "Testing Strapi products endpoint..."
PRODUCTS_RESPONSE=$(curl -s "$STRAPI_URL/products")
echo "$PRODUCTS_RESPONSE" | grep 'data' > /dev/null || fail "Strapi products endpoint failed"
pass "Strapi products endpoint works"

# 4. Test order endpoint (Backend)
info "Testing backend orders endpoint..."
ORDERS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/orders")
echo "$ORDERS_RESPONSE" | grep 'data' > /dev/null || fail "Backend orders endpoint failed"
pass "Backend orders endpoint works"

# 5. Test websocket connection (basic)
info "Testing websocket connection (manual step)..."
echo "Please verify real-time events in the dashboard UI by creating/updating an order or product."

# 6. Summary
pass "All automated integration checks passed!"
echo -e "${YELLOW}Next steps:${NC}"
echo "- Run through the manual checklist in INTEGRATION_TEST_CHECKLIST.md for full coverage."
echo "- Test real-time events and UI notifications."
echo "- Review logs for any errors."
