#!/bin/bash

# Security Implementation Verification Script
# Run this to verify that Phase 1 security implementation is complete

set -e

echo "🔍 Security Implementation Verification Script"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Check function
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} File exists: $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} Missing file: $1"
    ((FAILED++))
  fi
}

check_string_in_file() {
  if grep -q "$2" "$1" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Found '$2' in $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} Missing '$2' in $1"
    ((FAILED++))
  fi
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
  ((WARNINGS++))
}

echo "📦 Checking Created Files"
echo "-------------------------"
check_file "packages/shared/src/rbac/role-hierarchy.ts"
check_file "packages/api/src/trpc/middlewares/roles.middleware.ts"
check_file "packages/api/src/audit/audit.service.ts"
check_file "packages/api/src/audit/audit.module.ts"
check_file "packages/web/src/middleware/withFeatureFlagMiddleware.ts"
check_file "packages/web/src/app/[lang]/(private)/feature-disabled/page.tsx"
check_file "docs/00-conventions/security-architecture.md"
check_file "docs/00-conventions/security-quick-reference.md"
echo ""

echo "🔐 Checking Security Fixes"
echo "-------------------------"
check_string_in_file "packages/api/src/trpc/routers/feature-flags.router.ts" "requireRoles(UserRole.ADMIN)"
check_string_in_file "packages/web/src/middleware/withAuthMiddleware.ts" "NODE_ENV === 'production'"
check_string_in_file "packages/api/src/auth/guards/roles.guard.ts" "hasRole"
check_string_in_file "packages/web/src/middleware/withAuthMiddleware.ts" "hasRole"
echo ""

echo "🗄️ Checking Database Schema"
echo "-------------------------"
check_string_in_file "packages/api/prisma/schema.prisma" "model AuditLog"
check_string_in_file "packages/api/prisma/schema.prisma" "auditLogs"
echo ""

echo "🔗 Checking Exports"
echo "-------------------------"
check_string_in_file "packages/shared/src/index.ts" "rbac/role-hierarchy"
check_string_in_file "packages/web/middleware.ts" "withFeatureFlagMiddleware"
echo ""

echo "📝 Checking Documentation"
echo "-------------------------"
check_file "SECURITY_ARCHITECTURE_IMPLEMENTATION.md"
check_file "IMPLEMENTATION_COMPLETE.md"
echo ""

echo "🧪 Running TypeScript Checks"
echo "-------------------------"
cd packages/api
if npm run type-check > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} API TypeScript: PASS"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} API TypeScript: FAIL"
  ((FAILED++))
fi
cd ../..

echo ""
echo "🔍 Checking Environment Configuration"
echo "-------------------------------------"
if [ -f "packages/api/.env" ]; then
  if grep -q "SKIP_AUTH=true" packages/api/.env 2>/dev/null; then
    warn "SKIP_AUTH=true is set in .env (OK for development)"
  else
    echo -e "${GREEN}✓${NC} No SKIP_AUTH bypass in .env"
    ((PASSED++))
  fi
else
  warn "No .env file found in packages/api"
fi

if [ -f "packages/web/.env.local" ]; then
  echo -e "${GREEN}✓${NC} Web .env.local exists"
  ((PASSED++))
else
  warn "No .env.local file found in packages/web"
fi
echo ""

echo "📊 Checking Prisma Client"
echo "-------------------------"
if [ -d "node_modules/@prisma/client" ]; then
  if grep -q "auditLog" node_modules/@prisma/client/index.d.ts 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Prisma Client includes AuditLog model"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} Prisma Client missing AuditLog model"
    echo "   Run: cd packages/api && npx prisma generate"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗${NC} Prisma Client not found"
  echo "   Run: cd packages/api && npx prisma generate"
  ((FAILED++))
fi
echo ""

echo "=============================================="
echo "📊 Verification Summary"
echo "=============================================="
echo -e "Passed:   ${GREEN}${PASSED}${NC}"
echo -e "Failed:   ${RED}${FAILED}${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All critical checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: cd packages/api && npx prisma migrate dev --name add_audit_logs"
  echo "2. Test role hierarchy manually"
  echo "3. Test feature flag protection"
  echo "4. Deploy to staging"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please review the output above.${NC}"
  exit 1
fi
