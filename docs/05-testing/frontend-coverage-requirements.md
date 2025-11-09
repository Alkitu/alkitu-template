# Frontend Coverage Requirements

Coverage thresholds and quality gates for frontend testing.

---

## Coverage Thresholds

### By Component Type

| Component Type | Coverage Required | Test Count |
|----------------|-------------------|------------|
| **Atoms** | 95%+ | 8-10 tests minimum |
| **Molecules** | 90%+ | 5-8 tests minimum |
| **Organisms** | 95%+ | 10-15 tests minimum |
| **Templates** | 85%+ | Varies |
| **Pages** | 80%+ | E2E coverage instead |

### Coverage Categories

All components must achieve minimum thresholds in:
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

---

## Quality Gates

### Unit Tests (Vitest)
- ✅ All tests passing
- ✅ Coverage thresholds met
- ✅ No accessibility violations (jest-axe)
- ✅ Tests execute in < 10 seconds

### E2E Tests (Playwright)
- ✅ Critical flows covered (login, checkout)
- ✅ All tests passing on 3 browsers
- ✅ Tests execute in < 2 minutes

### Visual Regression (Chromatic)
- ✅ All stories created for shared components
- ✅ No unexpected visual changes
- ✅ All variants captured

---

## Test Requirements by Feature Type

### Shared Components (Design System)
- **Coverage**: 95%+ (strict)
- **Tests**: Unit + Storybook + Accessibility
- **E2E**: Not required
- **Visual**: Required (Chromatic)

### Feature Components (App-specific)
- **Coverage**: 90%+
- **Tests**: Unit + Accessibility
- **E2E**: If critical flow
- **Visual**: Optional

### Page Components
- **Coverage**: 80%+ (composition only)
- **Tests**: Unit (minimal) + E2E
- **E2E**: Required
- **Visual**: Not required

---

## Accessibility Requirements

All interactive components must:
- ✅ Pass jest-axe (no violations)
- ✅ Support keyboard navigation
- ✅ Have proper ARIA attributes
- ✅ Meet WCAG 2.1 Level AA contrast ratios

---

## Mutation Testing (Future)

While not currently implemented, mutation testing may be added:
- **Target Score**: 80%+ for critical components
- **Tool**: Stryker (when configured)

---

## CI/CD Gates

### Pull Request Requirements
- ✅ All tests passing
- ✅ Coverage thresholds met
- ✅ No new accessibility violations
- ✅ Visual regression approved (if applicable)

### Deployment Requirements
- ✅ All quality gates passing
- ✅ E2E tests passing on staging
- ✅ No critical bugs from test failures

---

## Reporting

### Coverage Report Location
```
packages/web/coverage/
├── lcov-report/index.html   # HTML coverage report
├── lcov.info                # LCOV format
└── coverage-summary.json    # JSON summary
```

### View Coverage Report
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

---

## Exemptions

Components that may have lower coverage:
- **Third-party integrations**: 70%+ (hard to test)
- **Generated code**: Exempt
- **Deprecated components**: Exempt

All exemptions must be documented and approved.

---

**Last Updated**: 2025-01-09
