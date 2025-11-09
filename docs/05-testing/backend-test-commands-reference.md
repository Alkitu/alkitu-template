# Backend Test Commands Reference

Quick reference for all backend testing commands.

---

## Unit Tests (Jest)

```bash
# Run all tests once
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# TDD mode (optimized for test-driven development)
npm run test:tdd

# Coverage report (95%+ required)
npm run test:cov

# Debug mode
npm run test:debug

# Run specific test file
npm run test -- user.service.spec.ts

# Run tests matching pattern
npm run test -- --testNamePattern="should create user"
```

---

## Integration Tests

```bash
# Run all integration tests
npm run test:int

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:e2e:cov
```

---

## Mutation Testing (Stryker)

```bash
# Run mutation tests (85%+ score required)
npm run test:mutation

# Watch mode for mutation testing
npm run test:mutation:watch

# Generate mutation report
npm run test:mutation -- --reporters html

# Run mutation on specific file
npm run test:mutation -- --mutate="src/users/**/*.ts"
```

---

## SOLID Compliance Tests

```bash
# Verify SOLID principles compliance
npm run test:solid
```

---

## Quality Gates

```bash
# Run all quality checks (coverage + mutation + lint + type-check)
npm run quality:gates

# Individual checks
npm run lint
npm run type-check
npm run test:cov
npm run test:mutation
```

---

## Contract Tests

```bash
# Run only contract tests
npm run test -- --testPathPattern="contract.spec.ts"
```

---

## Performance Tests

```bash
# Run performance tests
npm run test:perf

# Run load tests
npm run test:load
```

---

## Combined Commands

```bash
# Full test suite
npm run test && npm run test:e2e && npm run test:mutation

# Pre-commit checks
npm run quality:gates
```

---

## Useful Flags

### Jest Flags
```bash
npm run test -- --coverage           # Show coverage
npm run test -- --verbose            # Detailed output
npm run test -- --bail               # Stop on first failure
npm run test -- --detectOpenHandles  # Find memory leaks
npm run test -- --runInBand          # Run serially (no parallel)
npm run test -- --silent             # Suppress console output
npm run test -- --clearCache         # Clear Jest cache
```

### Stryker Flags
```bash
--incremental            # Only mutate changed files
--reporters html         # HTML report
--reporters clear-text   # Console output
--concurrency 4          # Number of parallel workers
```

---

## Environment Variables

```bash
# Run tests in CI mode
CI=true npm run test

# Increase test timeout
TEST_TIMEOUT=10000 npm run test

# Run tests with specific database
DATABASE_URL=mongodb://localhost:27017/test npm run test:e2e
```

---

**Last Updated**: 2025-01-09
