# Phase 3: Organisms Migration - Complete Analysis Report

**Date**: 2026-02-09
**Status**: Analysis Complete, Ready for Execution
**Total Organisms**: 20 Standard + 7 Alianza = 27 total

---

## Executive Summary

### Key Findings

| Category | Count | LOC | Status |
|----------|-------|-----|--------|
| **Design System** (to migrate) | 9 organisms | ~1,887 LOC | Ready to migrate |
| **Domain-Specific** (keep as-is) | 11 organisms | ~6,514 LOC | Keep in organisms/ |
| **Alianza (existing)** | 7 organisms | ~1,257 LOC | Need tests (0% coverage) |
| **TOTAL** | 27 organisms | ~9,658 LOC | - |

### Critical Priorities

1. ✅ **Import Mapping** - Complete (Agent 4)
2. ✅ **Categorization** - Complete (Agents 1-2)
3. ✅ **Alianza Analysis** - Complete (Agent 3)
4. ⏳ **Test Creation** - Pending (7 Alianza organisms, 0% coverage)
5. ⏳ **Migration Execution** - Pending (9 organisms to migrate)

---

## Import Count Summary (Agent 4 Results)

### High-Impact Organisms (>5 imports)

| Rank | Organism | Imports | Pages | Files | Complexity | Risk |
|------|----------|---------|-------|-------|-----------|------|
| 1 | auth/ | 52 | 10 | 10 | HIGH | **CRITICAL** |
| 2 | dashboard/ | 11 | 4 | 4 | MEDIUM | HIGH |
| 3 | request/ | 5 | 5 | 5 | VERY HIGH | HIGH |

### Medium-Impact Organisms (1-5 imports)

| Rank | Organism | Imports | Recommendation |
|------|----------|---------|----------------|
| 4 | onboarding/ | 3 | KEEP DOMAIN |
| 5 | admin/ | 3 | KEEP DOMAIN |
| 6 | profile/ | 2 | KEEP DOMAIN |
| 7 | request-template/ | 1 | MIGRATE |
| 8 | location/ | 1 | KEEP DOMAIN |
| 9 | category/ | 1 | KEEP DOMAIN |
| 10 | landing (combined) | 1 | MIGRATE |

### Zero-Import Organisms (Safe to migrate)

| Organism | LOC | Status |
|----------|-----|--------|
| footer/ | 102 | MIGRATE ✅ |
| hero/ | 168 | MIGRATE ✅ |
| feature-grid/ | 130 | MIGRATE ✅ |
| pricing-card/ | 162 | MIGRATE ✅ |
| sonner/ | 1389 | MIGRATE ✅ |
| theme/ | 175 | MIGRATE ✅ |
| theme-editor/ | 121 | MIGRATE ✅ |
| unauthorized/ | 111 | MIGRATE ✅ |

---

## Categorization Results (Agents 1-2)

### Design System Organisms (9 total - MIGRATE)

#### Batch A: Landing Components (4 organisms, 562 LOC)
1. **footer/** - 102 LOC, 1 test ✅
   - Generic footer layout
   - No business logic
   - Atoms/primitives only

2. **hero/** - 168 LOC, 1 test ✅
   - Generic hero section
   - Theme override support
   - Atoms-only imports

3. **feature-grid/** - 130 LOC, 1 test ✅
   - Generic feature grid layout
   - Pure composition
   - Zero dependencies

4. **pricing-card/** - 162 LOC, 1 test ✅
   - Generic pricing display
   - Configurable price/features/CTA
   - No domain logic

#### Batch B: Utility Components (4 organisms, 1,167 LOC)
5. **unauthorized/** - 111 LOC, 1 test ✅
   - Generic 403 error page
   - Highest test coverage (353%)
   - Configurable text

6. **theme-editor/** - 121 LOC, 1 test ✅
   - Theme editor wrapper
   - Feature component composition
   - No business logic

7. **request-template/** - 158 LOC, 1 test ✅
   - Dynamic form renderer
   - JSON template support
   - Fully generic

8. **theme/** - 175 LOC, 1 test ✅
   - Theme switcher UI
   - useGlobalTheme hook wrapper
   - Generic theme management

#### Batch C: Complex System (1 organism, 1,389 LOC)
9. **sonner/** - 1,389 LOC, 1 test ✅
   - Toast notification system
   - Context provider + hook
   - Positioning + animations
   - Self-contained

---

### Domain-Specific Organisms (11 total - KEEP)

#### Core Business Logic (Heavy tRPC Integration)
1. **admin/** - 633 LOC, 2 components, 2 tests ✅
   - RequestManagementTable, UserManagementTable
   - tRPC queries/mutations
   - Complex filtering, pagination, sorting
   - **Reason**: Admin-specific tables with API integration

2. **auth/** - 1,399 LOC, 9 components, 9 tests ✅
   - 9 auth flow organisms (login, register, reset, etc.)
   - 52 imports across 10 pages
   - Heavy tRPC integration
   - **Reason**: CRITICAL - Application-breaking if changed

3. **category/** - 482 LOC, 2 components, 2 tests ✅
   - CategoryFormOrganism, CategoryListOrganism
   - CreateCategorySchema from @alkitu/shared
   - API fetch calls
   - **Reason**: Category CRUD with schema validation

4. **dashboard/** - 424 LOC, 5 components, 5 tests ✅
   - DashboardOverview, RequestListOrganism, StatsCardGrid
   - 11 imports across 4 pages (admin/client/employee)
   - Domain-specific data structures
   - **Reason**: Dashboard composition for multiple roles

5. **email-template/** - 367 LOC, 1 component, 1 test ✅
   - EmailTemplateFormOrganism
   - createEmailTemplateSchema from @alkitu/shared
   - tRPC mutations
   - **Reason**: Email template CRUD with complex state

6. **icon-uploader/** - 327 LOC, 1 component, 1 test ✅
   - IconUploaderOrganism
   - File validation, SVG processing, preview generation
   - Callback-based architecture
   - **Reason**: Specialized workflow for icon upload

7. **location/** - 643 LOC, 2 components, 2 tests ✅
   - LocationFormOrganism, LocationListOrganism
   - US_STATE_CODES, WorkLocation from @alkitu/shared
   - State/ZIP validation
   - **Reason**: Work location management with business rules

8. **onboarding/** - 567 LOC, 2 components, 2 tests ✅
   - OnboardingFormOrganism, OnboardingStepsCard
   - API calls to `/api/auth/complete-profile`
   - Auth flow integration
   - **Reason**: User registration workflow

9. **profile/** - 1,063 LOC, 3 components, 3 tests ✅
   - ProfileFormClientOrganism, ProfileFormEmployeeOrganism
   - Role-specific forms
   - API calls to `/api/users/profile`
   - **Reason**: Role-based user profile management

10. **request/** - 1,700 LOC, 5 components, 4 tests ✅
    - RequestDetailOrganism, RequestFormOrganism, RequestListOrganism
    - RequestStatus from @alkitu/shared
    - tRPC integration, state management, timeline tracking
    - **Reason**: CORE business domain - request management

11. **service/** - 702 LOC, 2 components, 2 tests ✅
    - ServiceFormOrganism, ServiceListOrganism
    - CreateServiceSchema from @alkitu/shared
    - JSON template editing, Zod validation
    - **Reason**: Service management with schema integration

---

## Alianza Organisms Analysis (Agent 3 Results)

### Critical Issues Found

| Issue | Count | Impact |
|-------|-------|--------|
| **0% Test Coverage** | 7/7 | CRITICAL |
| **Missing .types.ts** | 5/7 | HIGH |
| **Wrong Structure** | 5/7 | MEDIUM |
| **Total Missing Tests** | 83-101 | HIGH |

### Detailed Status

#### ✅ Correct Structure (2/7)
1. **RequestsTableAlianza/** - 260 LOC
   - ✅ Directory structure
   - ✅ .types.ts file
   - ✅ index.ts
   - ❌ NO TESTS

2. **RequestsTableSkeleton/** - 99 LOC
   - ✅ Directory structure
   - ✅ .types.ts file
   - ✅ index.ts
   - ❌ NO TESTS

#### ❌ Needs Refactoring (5/7)

3. **ChatConversationsTableAlianza.tsx** - 153 LOC, MEDIUM complexity
   - ❌ Standalone file (should be directory)
   - ❌ No .types.ts
   - ❌ No tests
   - 5 props, 1 hook
   - **Est. effort**: 2-3 hours

4. **HeaderAlianza.tsx** - 313 LOC, **VERY HIGH complexity**
   - ❌ Standalone file (should be directory)
   - ❌ No .types.ts
   - ❌ No tests
   - 7 hooks, auth/i18n/routing/theme logic
   - **Est. effort**: 4-5 hours
   - **Note**: Should be refactored into sub-components

5. **ServicesTableAlianza.tsx** - 157 LOC, MEDIUM complexity
   - ❌ Standalone file (should be directory)
   - ❌ No .types.ts
   - ❌ No tests
   - 5 props, inline StatusBadge
   - **Est. effort**: 2-3 hours

6. **UsersTableAlianza.tsx** - 201 LOC, MEDIUM complexity
   - ❌ Standalone file (should be directory)
   - ❌ No .types.ts
   - ❌ No tests
   - 8 props, 2 helper functions
   - **Est. effort**: 2-3 hours

7. **UsersTableSkeleton.tsx** - 74 LOC, LOW complexity
   - ❌ Standalone file (should be directory)
   - ❌ No .types.ts
   - ❌ No tests
   - 2 props (simple)
   - **Est. effort**: 1-1.5 hours

### Test Creation Estimates

| Component | Tests Needed | Est. Time | Priority |
|-----------|-------------|-----------|----------|
| HeaderAlianza | 20-25 | 4-5 hrs | CRITICAL |
| RequestsTableAlianza | 15-18 | 2.5-3.5 hrs | HIGH |
| UsersTableAlianza | 14-16 | 2-3 hrs | MEDIUM |
| ChatConversationsTableAlianza | 12-15 | 2-3 hrs | MEDIUM |
| ServicesTableAlianza | 12-15 | 2-3 hrs | MEDIUM |
| RequestsTableSkeleton | 5-6 | 1-1.5 hrs | LOW |
| UsersTableSkeleton | 5-6 | 1-1.5 hrs | LOW |
| **TOTAL** | **83-101** | **15-21 hrs** | - |

---

## Migration Strategy & Batches

### Phase 3 Execution Plan

#### Pre-Migration: Fix Alianza Organisms (CRITICAL)
**Before migrating any Standard organisms, fix existing Alianza:**

**Batch 0A: Refactor Alianza Structure (5 components)**
- Convert standalone files to directories
- Extract .types.ts files
- Create index.ts barrel exports
- **Est. effort**: 2-3 hours

**Batch 0B: Create Alianza Tests (7 components)**
- Write comprehensive test suites
- Achieve 95%+ coverage target
- **Est. effort**: 15-21 hours

---

#### Migration Batches (9 organisms)

**Batch 1: Landing Components (4 organisms, 562 LOC)**
- footer/ (102 LOC)
- hero/ (168 LOC)
- feature-grid/ (130 LOC)
- pricing-card/ (162 LOC)
- **Risk**: LOW (0-1 imports each)
- **Effort**: MINIMAL (~2-3 hours)
- **Reason**: Proof-of-concept, zero dependencies

**Batch 2: Simple Utilities (3 organisms, 445 LOC)**
- unauthorized/ (111 LOC, 0 imports)
- theme-editor/ (121 LOC, 0 imports)
- request-template/ (158 LOC, 1 import)
- **Risk**: LOW
- **Effort**: MINIMAL (~2-3 hours)
- **Reason**: Self-contained, minimal impact

**Batch 3: Theme Components (1 organism, 175 LOC)**
- theme/ (175 LOC, 0 imports)
- **Risk**: LOW
- **Effort**: MINIMAL (~1-2 hours)
- **Reason**: Generic theme switcher

**Batch 4: Notification System (1 organism, 1,389 LOC)**
- sonner/ (1,389 LOC, 0 imports)
- **Risk**: MEDIUM (context provider)
- **Effort**: MEDIUM (~3-4 hours)
- **Reason**: Largest component, context API integration

---

#### Domain Organisms (KEEP AS-IS, 11 organisms)

**No migration - Remain in organisms/**:
- admin/ (633 LOC, 3 imports)
- auth/ (1,399 LOC, 52 imports) - CRITICAL
- category/ (482 LOC, 1 import)
- dashboard/ (424 LOC, 11 imports)
- email-template/ (367 LOC, 0 imports)
- icon-uploader/ (327 LOC, 0 imports)
- location/ (643 LOC, 1 import)
- onboarding/ (567 LOC, 3 imports)
- profile/ (1,063 LOC, 2 imports)
- request/ (1,700 LOC, 5 imports)
- service/ (702 LOC, 0 imports)

**Total Domain LOC**: 6,514 (will remain in organisms/)

---

## Success Metrics

### Before Phase 3
- **Standard organisms**: 20 directories
- **Alianza organisms**: 7 components (0% test coverage)
- **Total LOC**: ~9,658

### After Phase 3 (Target)
- **Standard organisms (domain)**: 11 directories (~6,514 LOC)
- **Alianza organisms (design system)**: 16 components (~3,144 LOC)
- **Test coverage**: 95%+ for all Alianza organisms
- **Structure compliance**: 100% (all directories, .types.ts, .test.tsx)
- **Imports updated**: ~15 files

---

## Risk Assessment

### Critical Risks

1. **Auth Organism (52 imports)** - Application-breaking if migrated incorrectly
   - **Mitigation**: Keep in organisms/ (domain-specific)

2. **Dashboard (11 imports, 4 pages)** - Multi-role visibility
   - **Mitigation**: Keep in organisms/ (domain-specific)

3. **Alianza 0% Test Coverage** - Quality gate failure
   - **Mitigation**: Batch 0B - Create all tests before migration

### Medium Risks

1. **Sonner Context Provider** - Complex state management
   - **Mitigation**: Thorough testing, migrate in separate batch

2. **HeaderAlianza Complexity** - 7 hooks, multiple concerns
   - **Mitigation**: Consider refactoring before adding more tests

### Low Risks

1. **Landing Components** - Zero dependencies
   - **Mitigation**: None needed, safe to migrate

---

## Next Steps

### Immediate Actions (Week 1)

1. ✅ **Complete Analysis** - DONE
2. ⏳ **Batch 0A**: Refactor 5 Alianza files to directories
3. ⏳ **Batch 0B**: Create tests for 7 Alianza organisms

### Short-term (Week 2)

4. ⏳ **Batch 1**: Migrate landing components (footer, hero, feature-grid, pricing-card)
5. ⏳ **Batch 2**: Migrate utilities (unauthorized, theme-editor, request-template)

### Medium-term (Week 3)

6. ⏳ **Batch 3**: Migrate theme components
7. ⏳ **Batch 4**: Migrate sonner notification system
8. ⏳ **Final Validation**: TypeScript, tests, imports

---

## Appendix: Agent Summaries

### Agent 1: A-L Analysis ✅
- Analyzed: admin, auth, category, dashboard, email-template, feature-grid, footer, hero, icon-uploader, location
- Design System: 3 (footer, hero, feature-grid)
- Domain: 7
- Test coverage: 100% (28 test files)

### Agent 2: M-Z Analysis ✅
- Analyzed: onboarding, pricing-card, profile, request, request-template, service, sonner, theme, theme-editor, unauthorized
- Design System: 6
- Domain: 4
- Test coverage: 100% (18 test files)

### Agent 3: Alianza Analysis ✅
- Analyzed: 7 Alianza organisms
- Test coverage: 0% (0 test files)
- Structure compliance: 29% (2/7 correct)
- Total tests needed: 83-101

### Agent 4: Import Mapping ✅
- Total organisms: 20
- Total imports tracked: 79+
- High-impact: 3 organisms (auth, dashboard, request)
- Zero-import: 8 organisms (safe to migrate)
- Inter-organism dependencies: 2 (minimal coupling)

---

**End of Analysis Report**
