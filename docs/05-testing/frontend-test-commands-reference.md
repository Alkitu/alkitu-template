# Frontend Test Commands Reference

Quick reference for all frontend testing commands.

---

## Unit Tests (Vitest)

```bash
# Run all tests once
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# UI mode (interactive browser interface)
npm run test:ui

# Coverage report
npm run test:coverage

# Run specific test file
npm run test Button.test.tsx

# Run tests matching pattern
npm run test -- --grep "Button"
```

---

## E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Interactive UI mode
npm run test:e2e:ui

# Debug mode (pause execution)
npm run test:e2e:debug

# Run specific test file
npm run test:e2e tests/e2e/login.spec.ts

# Run in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Run on all browsers
npm run test:e2e -- --project=chromium --project=firefox --project=webkit

# Generate test with codegen
npm run test:e2e:codegen http://localhost:3000
```

---

## Visual Regression (Storybook + Chromatic)

```bash
# Start Storybook dev server (port 6006)
npm run storybook

# Build Storybook for production
npm run build-storybook

# Run Chromatic visual regression
npm run test:visual

# Publish to Chromatic (with token)
npx chromatic --project-token=YOUR_TOKEN
```

---

## Combined Commands

```bash
# Run all frontend tests (unit + E2E)
npm run test && npm run test:e2e

# Full quality check
npm run test:coverage && npm run test:e2e && npm run storybook
```

---

## Useful Flags

### Vitest Flags
```bash
npm run test -- --coverage           # Show coverage
npm run test -- --ui                 # Open UI mode
npm run test -- --run                # Run once (no watch)
npm run test -- --reporter=verbose   # Detailed output
npm run test -- --bail               # Stop on first failure
```

### Playwright Flags
```bash
--headed                 # Show browser
--debug                  # Debug mode
--ui                     # Interactive mode
--trace on               # Record trace
--reporter=html          # HTML report
--grep "login"           # Run tests matching pattern
--project=chromium       # Specific browser
```

---

**Last Updated**: 2025-01-09
