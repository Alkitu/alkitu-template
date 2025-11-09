# Backend Coverage Requirements

Coverage and mutation testing requirements for NestJS backend.

---

## Coverage Thresholds

### By Component Type

| Component Type | Coverage Required | Mutation Score |
|----------------|-------------------|----------------|
| **Services** | 95%+ | 90%+ (critical) |
| **Repositories** | 90%+ | 85%+ |
| **Controllers** | 90%+ | 85%+ |
| **Utilities** | 100% | 90%+ |
| **Guards** | 95%+ | 85%+ |
| **Pipes** | 95%+ | 85%+ |
| **Filters** | 90%+ | 80%+ |
| **Interceptors** | 90%+ | 80%+ |

### Global Thresholds

- **Overall Coverage**: 90%+ across entire backend
- **Critical Services**: 95%+ (user auth, payments, data processing)
- **Overall Mutation Score**: 85%+

---

## Coverage Categories

All components must achieve minimum in:
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

---

## Mutation Testing Requirements

### Mutation Score Targets

- **Critical Business Logic**: 90%+
- **Data Access Layer**: 85%+
- **API Controllers**: 85%+
- **Utility Functions**: 90%+

### Mutation Operators Enabled
- ✅ Arithmetic operators (`+`, `-`, `*`, `/`)
- ✅ Logical operators (`&&`, `||`, `!`)
- ✅ Comparison operators (`>`, `<`, `===`, `!==`)
- ✅ Conditional expressions
- ✅ String literals
- ✅ Boolean literals

### Performance Requirements
- **Test Speed**: < 10 seconds for full unit test suite
- **Mutation Speed**: < 15 minutes (optimized with incremental mode)

---

## Quality Gates

### TDD Workflow (Required)
- 🔴 **RED**: Write failing tests first
- 🟢 **GREEN**: Write minimal code to pass
- 🔵 **REFACTOR**: Improve code quality
- ✅ **VALIDATE**: Run mutation tests

### Pre-Commit Checks
- ✅ All tests passing
- ✅ Coverage ≥ 90%
- ✅ Mutation score ≥ 85%
- ✅ No linting errors
- ✅ Type-check passing

### CI/CD Pipeline Gates
```bash
npm run quality:gates
```
This runs:
1. Unit tests with coverage (Jest)
2. Mutation tests (Stryker)
3. Linting (ESLint)
4. Type checking (TypeScript)
5. SOLID compliance tests

---

## Test Types

### Unit Tests
- **Tool**: Jest
- **Location**: `src/**/__tests__/*.spec.ts`
- **Coverage**: 95%+ for services

### Contract Tests
- **Tool**: Jest
- **Location**: `src/**/__tests__/*.contract.spec.ts`
- **Coverage**: 100% of interface methods

### Integration Tests
- **Tool**: Jest + Supertest
- **Location**: `src/**/__tests__/integration/*.spec.ts`
- **Coverage**: API endpoints

### E2E Tests
- **Tool**: Jest + Supertest
- **Location**: `test/e2e/*.e2e-spec.ts`
- **Coverage**: Complete user flows

---

## Mutation Testing Details

### Stryker Configuration
```javascript
// stryker.conf.mjs
export default {
  mutate: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.interface.ts'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  thresholds: { high: 90, low: 85, break: 80 },
  incremental: true,
  incrementalFile: '.stryker-tmp/incremental.json',
};
```

### Mutant Types
- **Survived**: Test didn't catch the mutation (❌ BAD - write more tests)
- **Killed**: Test caught the mutation (✅ GOOD)
- **Timeout**: Mutation caused infinite loop (⚠️ WARNING)
- **No Coverage**: Code not tested (❌ BAD - add tests)

---

## Reporting

### Coverage Report Location
```
packages/api/coverage/
├── lcov-report/index.html    # HTML coverage report
├── lcov.info                 # LCOV format
└── coverage-summary.json     # JSON summary
```

### Mutation Report Location
```
packages/api/reports/mutation/
└── mutation.html             # Stryker HTML report
```

### View Reports
```bash
# Coverage report
npm run test:cov
open coverage/lcov-report/index.html

# Mutation report
npm run test:mutation
open reports/mutation/mutation.html
```

---

## Exemptions

Components that may have lower thresholds:
- **DTOs**: Coverage exempt (no logic)
- **Entities**: Coverage exempt (Prisma models)
- **Interfaces**: Coverage exempt (type definitions)
- **Main.ts**: 70%+ (bootstrap code)
- **Third-party adapters**: 80%+

All exemptions must be documented in code comments.

---

## SOLID Compliance

In addition to coverage and mutation:
- ✅ Single Responsibility verified
- ✅ Open/Closed principle enforced
- ✅ Liskov Substitution tested (contract tests)
- ✅ Interface Segregation validated
- ✅ Dependency Inversion implemented

Run: `npm run test:solid`

---

## Performance Benchmarks

### Test Execution Speed
- **Unit tests**: < 10 seconds
- **Integration tests**: < 30 seconds
- **E2E tests**: < 60 seconds
- **Mutation tests**: < 15 minutes (with incremental mode)

If tests exceed these times, optimize with:
- Better mocking
- Parallel execution
- Test isolation improvements

---

**Last Updated**: 2025-01-09
