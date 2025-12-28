#!/bin/sh
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${YELLOW}🚀 Starting API Gateway...${NC}"

# Check required environment variables
check_env() {
  local var=$1
  local value=$(eval echo \$$var)
  if [ -z "$value" ]; then
    echo "${RED}❌ Error: Required environment variable $var is not set${NC}"
    exit 1
  fi
  echo "${GREEN}✓ $var is set${NC}"
}

# Only check in production
if [ "$NODE_ENV" = "production" ]; then
  echo "${YELLOW}Checking required environment variables for production...${NC}"
  check_env "ALLOWED_ORIGINS"
fi

# Set default service URLs if not provided
export USER_SERVICE_URL=${USER_SERVICE_URL:-http://user-service:3001}
export CHAT_SERVICE_URL=${CHAT_SERVICE_URL:-http://chat-service:3002}
export NOTIFICATION_SERVICE_URL=${NOTIFICATION_SERVICE_URL:-http://notification-service:3003}

echo "${GREEN}✓ Service URLs configured:${NC}"
echo "  - User Service: $USER_SERVICE_URL"
echo "  - Chat Service: $CHAT_SERVICE_URL"
echo "  - Notification Service: $NOTIFICATION_SERVICE_URL"

# Start the application immediately (do NOT wait for downstream services)
echo "${GREEN}✓ Starting application without waiting for downstream services...${NC}"
echo "${YELLOW}🌐 Gateway running on port 3000${NC}"
echo "${YELLOW}📍 Health check endpoint: http://localhost:3000/healthz${NC}"
echo "${YELLOW}📊 Metrics endpoint: http://localhost:3000/metrics${NC}"

exec node dist/apps/api-gateway/main.js
