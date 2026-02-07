#!/bin/bash

# ============================================
# Docker Build Helper Script
# Builds and tests Docker images locally
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Alkitu Docker Build Helper${NC}\n"

# ==========================================
# Functions
# ==========================================

build_backend() {
    echo -e "${YELLOW}📦 Building Backend Image...${NC}"
    cd "$(dirname "$0")/.."
    docker build -t alkitu-api:latest -f packages/api/Dockerfile .
    echo -e "${GREEN}✅ Backend image built successfully${NC}\n"
}

build_frontend() {
    echo -e "${YELLOW}📦 Building Frontend Image...${NC}"
    cd "$(dirname "$0")/.."
    docker build -t alkitu-web:latest -f packages/web/Dockerfile .
    echo -e "${GREEN}✅ Frontend image built successfully${NC}\n"
}

test_backend() {
    echo -e "${YELLOW}🧪 Testing Backend Image...${NC}"

    # Start container in detached mode
    docker run -d \
        --name alkitu-api-test \
        -p 3001:3001 \
        -e DATABASE_URL="${DATABASE_URL}" \
        -e JWT_SECRET="test-secret-min-32-characters-long" \
        alkitu-api:latest

    # Wait for container to be ready
    echo "Waiting for container to start..."
    sleep 5

    # Test health endpoint
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend health check passed${NC}\n"
    else
        echo -e "${RED}❌ Backend health check failed${NC}\n"
        docker logs alkitu-api-test
        docker stop alkitu-api-test > /dev/null 2>&1
        docker rm alkitu-api-test > /dev/null 2>&1
        exit 1
    fi

    # Cleanup
    docker stop alkitu-api-test > /dev/null 2>&1
    docker rm alkitu-api-test > /dev/null 2>&1
}

test_frontend() {
    echo -e "${YELLOW}🧪 Testing Frontend Image...${NC}"

    # Start container in detached mode
    docker run -d \
        --name alkitu-web-test \
        -p 3000:3000 \
        -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
        alkitu-web:latest

    # Wait for container to be ready
    echo "Waiting for container to start..."
    sleep 5

    # Test if Next.js is responding
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend health check passed${NC}\n"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}\n"
        docker logs alkitu-web-test
        docker stop alkitu-web-test > /dev/null 2>&1
        docker rm alkitu-web-test > /dev/null 2>&1
        exit 1
    fi

    # Cleanup
    docker stop alkitu-web-test > /dev/null 2>&1
    docker rm alkitu-web-test > /dev/null 2>&1
}

show_images() {
    echo -e "${YELLOW}📋 Docker Images:${NC}"
    docker images | grep -E "REPOSITORY|alkitu"
    echo ""
}

cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
    docker image prune -f
    echo -e "${GREEN}✅ Cleanup complete${NC}\n"
}

# ==========================================
# Main Script
# ==========================================

case "${1}" in
    backend)
        build_backend
        test_backend
        ;;
    frontend)
        build_frontend
        test_frontend
        ;;
    all)
        build_backend
        build_frontend
        test_backend
        test_frontend
        ;;
    test)
        test_backend
        test_frontend
        ;;
    images)
        show_images
        ;;
    cleanup)
        cleanup
        ;;
    *)
        echo -e "${YELLOW}Usage:${NC}"
        echo "  ./scripts/docker-build.sh backend   - Build and test backend"
        echo "  ./scripts/docker-build.sh frontend  - Build and test frontend"
        echo "  ./scripts/docker-build.sh all       - Build and test both"
        echo "  ./scripts/docker-build.sh test      - Test existing images"
        echo "  ./scripts/docker-build.sh images    - Show built images"
        echo "  ./scripts/docker-build.sh cleanup   - Clean up old images"
        exit 1
        ;;
esac

echo -e "${GREEN}🎉 Done!${NC}"
