#!/bin/bash

# Feature Flags System - Automated Verification Script
# Run this script to verify the implementation is working correctly

set -e

echo "🔍 Feature Flags System - Verification Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to print info
info() {
    echo -e "ℹ️  $1"
}

echo "Phase 1: Backend Verification"
echo "-----------------------------"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    error "Not in project root directory"
    exit 1
fi

# Check Prisma schema
info "Checking Prisma schema..."
if grep -q "model FeatureFlag" packages/api/prisma/schema.prisma; then
    success "FeatureFlag model exists in schema"
else
    error "FeatureFlag model not found in schema"
    exit 1
fi

if grep -q "enum ConversationType" packages/api/prisma/schema.prisma; then
    success "ConversationType enum exists in schema"
else
    error "ConversationType enum not found in schema"
    exit 1
fi

# Check if backend compiles
info "Compiling backend..."
cd packages/api
if npm run build > /dev/null 2>&1; then
    success "Backend compiles without errors"
else
    error "Backend compilation failed"
    exit 1
fi
cd ../..

# Check if feature flags service exists
if [ -f "packages/api/src/feature-flags/feature-flags.service.ts" ]; then
    success "FeatureFlagsService exists"
else
    error "FeatureFlagsService not found"
    exit 1
fi

# Check if router exists
if [ -f "packages/api/src/trpc/routers/feature-flags.router.ts" ]; then
    success "Feature flags router exists"
else
    error "Feature flags router not found"
    exit 1
fi

echo ""
echo "Phase 2: Frontend Verification"
echo "------------------------------"

# Check if useFeatureFlag hook exists
if [ -f "packages/web/src/hooks/useFeatureFlag.ts" ]; then
    success "useFeatureFlag hook exists"
else
    error "useFeatureFlag hook not found"
    exit 1
fi

# Check if addons page exists
if [ -f "packages/web/src/app/[lang]/(private)/admin/settings/addons/page.tsx" ]; then
    success "Addons settings page exists"
else
    error "Addons settings page not found"
    exit 1
fi

# Check if RequestChatPanel exists
if [ -f "packages/web/src/components/organisms/request/RequestChatPanel.tsx" ]; then
    success "RequestChatPanel component exists"
else
    error "RequestChatPanel component not found"
    exit 1
fi

# Check if frontend builds
info "Building frontend (this may take a minute)..."
cd packages/web
if SKIP_ENV_VALIDATION=true npm run build > /dev/null 2>&1; then
    success "Frontend builds without errors"
else
    error "Frontend build failed"
    exit 1
fi
cd ../..

echo ""
echo "Phase 3: Database Verification"
echo "------------------------------"

# Check if seed file exists
if [ -f "packages/api/prisma/seeds/feature-flags.seed.ts" ]; then
    success "Feature flags seed file exists"
else
    error "Feature flags seed file not found"
    exit 1
fi

# Ask user to verify database manually
warning "Please verify database manually using: npx prisma studio"
info "Expected: 3 feature flags (chat, analytics, notifications)"

echo ""
echo "Phase 4: Integration Check"
echo "-------------------------"

# Check if settings page was modified
if grep -q "Addons & Features" packages/web/src/app/\[lang\]/\(private\)/admin/settings/page.tsx; then
    success "Settings page includes Addons card"
else
    error "Settings page not modified"
    exit 1
fi

# Check if RequestDetailOrganism includes chat panel
if grep -q "RequestChatPanel" packages/web/src/components/organisms/request/RequestDetailOrganism.tsx; then
    success "RequestDetailOrganism integrates chat panel"
else
    error "RequestDetailOrganism not integrated with chat panel"
    exit 1
fi

# Check if useFeatureFlag is used
if grep -q "useFeatureFlag" packages/web/src/components/organisms/request/RequestDetailOrganism.tsx; then
    success "Feature flag check implemented in RequestDetailOrganism"
else
    error "Feature flag check not implemented"
    exit 1
fi

echo ""
echo "Phase 5: Documentation Check"
echo "----------------------------"

if [ -f "docs/00-conventions/feature-flags-system.md" ]; then
    success "Feature flags documentation exists"
else
    error "Documentation not found"
    exit 1
fi

if [ -f "FEATURE_FLAGS_VERIFICATION.md" ]; then
    success "Verification checklist exists"
else
    error "Verification checklist not found"
    exit 1
fi

echo ""
echo "=============================================="
echo -e "${GREEN}✅ All automated checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start services: npm run dev"
echo "2. Navigate to: http://localhost:3000/admin/settings/addons"
echo "3. Follow manual testing in FEATURE_FLAGS_VERIFICATION.md"
echo ""
echo "Quick test commands:"
echo "  npm run dev                    # Start all services"
echo "  npx prisma studio              # View database"
echo "  npm run type-check             # Check types"
echo ""
