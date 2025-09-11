#!/bin/bash

# test_health.sh
# Test script to verify your backend health endpoint is working

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if URL is provided
if [ -z "$1" ]; then
    print_error "Please provide your backend URL"
    echo "Usage: ./test_health.sh https://your-backend.onrender.com"
    echo "Example: ./test_health.sh https://renteasy-backend.onrender.com"
    exit 1
fi

BACKEND_URL="$1"
HEALTH_ENDPOINT="${BACKEND_URL}/healthz"

print_info "Testing health endpoint: $HEALTH_ENDPOINT"
echo ""

# Test the health endpoint
print_info "Making request to health endpoint..."
response=$(curl -s -w "\n%{http_code}" "$HEALTH_ENDPOINT" 2>/dev/null)

# Extract HTTP status code and response body
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)

echo ""
print_info "Response Details:"
echo "HTTP Status Code: $http_code"
echo "Response Body: $response_body"
echo ""

# Check if the request was successful
if [ "$http_code" = "200" ]; then
    print_status "Health endpoint is working correctly!"
    print_status "Your backend is ready for UptimeRobot monitoring"
    echo ""
    print_info "Next steps:"
    echo "1. Go to https://uptimerobot.com"
    echo "2. Create a free account"
    echo "3. Add new monitor with URL: $HEALTH_ENDPOINT"
    echo "4. Set monitoring interval to 5 minutes"
else
    print_error "Health endpoint is not responding correctly"
    print_error "HTTP Status: $http_code"
    echo ""
    print_warning "Possible issues:"
    echo "- Backend is not deployed yet"
    echo "- Backend is sleeping (cold start needed)"
    echo "- Incorrect URL provided"
    echo "- Backend has an error"
    echo ""
    print_info "Try again in a few minutes if you just deployed"
fi

echo ""
print_info "Test completed at $(date)"
