# Skeleton Components Tests - Quick Reference

## Test Files Created

### RequestsTableSkeleton
- **Path**: `/packages/web/src/components/organisms-alianza/RequestsTableSkeleton/RequestsTableSkeleton.test.tsx`
- **Tests**: 9
- **Coverage**: 100%

### UsersTableSkeleton
- **Path**: `/packages/web/src/components/organisms-alianza/UsersTableSkeleton/UsersTableSkeleton.test.tsx`
- **Tests**: 10
- **Coverage**: 100%

---

## Quick Commands

### Run Both Test Suites
```bash
npm run test -- RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx
```

### Run Individual Tests
```bash
# RequestsTableSkeleton only
npm run test -- RequestsTableSkeleton.test.tsx

# UsersTableSkeleton only
npm run test -- UsersTableSkeleton.test.tsx
```

### Run with Coverage
```bash
# Both components with coverage
npm run test -- --coverage RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx

# Individual component coverage
npm run test -- --coverage RequestsTableSkeleton
npm run test -- --coverage UsersTableSkeleton
```

### Run with Verbose Output
```bash
npm run test -- --reporter=verbose RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx
```

### Run in Watch Mode
```bash
npm run test -- --watch RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx
```

---

## Test Summary

| Component | Tests | Coverage | Status |
|-----------|-------|----------|--------|
| RequestsTableSkeleton | 9 | 100% | ✅ |
| UsersTableSkeleton | 10 | 100% | ✅ |
| **Total** | **19** | **100%** | ✅ |

---

## Expected Output

```
✓ RequestsTableSkeleton.test.tsx (9 tests)
✓ UsersTableSkeleton.test.tsx (10 tests)

Test Files  2 passed (2)
Tests       19 passed (19)
```

---

## Coverage Report

```
File                          | % Stmts | % Branch | % Funcs | % Lines
RequestsTableSkeleton.tsx     |     100 |      100 |     100 |     100
UsersTableSkeleton.tsx        |     100 |      100 |     100 |     100
```

---

## Test Categories

### RequestsTableSkeleton Tests
1. Default row count (5 rows)
2. Custom row count
3. Zero rows edge case
4. Custom className application
5. Table structure with headers
6. Skeleton cells with animation
7. Accessible table structure
8. Alternating row backgrounds
9. Action buttons skeleton

### UsersTableSkeleton Tests
1. Default row count (5 rows)
2. Custom row count
3. Zero rows edge case
4. Table structure with header skeletons
5. Skeleton elements per row
6. User column with avatar and text
7. Accessible table structure
8. Sticky header and actions column
9. Action column skeleton button
10. Wrapper classes validation

---

## Troubleshooting

### If tests fail
```bash
# Clear cache and re-run
npm run test -- --clearCache
npm run test -- RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx
```

### If coverage is not 100%
```bash
# Check which lines are uncovered
npm run test -- --coverage --coverage.reporter=html RequestsTableSkeleton.test.tsx UsersTableSkeleton.test.tsx
# Open packages/web/coverage/index.html
```

---

## Maintenance

### Adding New Tests
1. Open the relevant `.test.tsx` file
2. Add new test case using `it()` or `test()`
3. Run tests to verify: `npm run test -- <filename>`

### Updating Components
1. Update component in `.tsx` file
2. Update tests to match new behavior
3. Verify coverage remains at 100%

---

**Last Updated**: February 9, 2026
**Status**: Production Ready ✅
