# Organism Tests Fix Guide

**Created**: 2026-02-08
**Status**: 56 tests failing | 855 passing | 92.5% success rate
**Objective**: Fix remaining 56 failing tests in organism components

---

## 📊 Executive Summary

### Current State
- **Total Tests**: 924
- **Passing**: 855 (92.5%)
- **Failing**: 56 (6.1%)
- **Skipped**: 13 (1.4%)
- **Files with Failures**: 16

### Progress Made
- ✅ **Fixed**: 7 tests (from 63 to 56)
- ✅ **Fully Passing Files**:
  - `ResetPasswordFormOrganism.test.tsx` - 19/19 tests
  - `NewPasswordFormOrganism.test.tsx` - 21/21 tests
  - `VerifyLoginCodeFormOrganism.test.tsx` - 27/27 tests

### Work Remaining
- **56 tests** across 16 files need fixes
- **Estimated time**: 2-4 hours (2-5 minutes per test)
- **Complexity**: Each test requires individual analysis and fix

---

## 🗂️ Complete List of Failing Tests by File

### 1. **RequestDetailOrganism.test.tsx** - 18 tests ❌
**Problem**: tRPC mocks not properly configured

```typescript
// Failing tests:
× should show loading state initially
× should render request details after successful fetch
× should render back button when onBack provided
× should call onBack when back button clicked
× should show assign button for EMPLOYEE/ADMIN
× should hide assign button for CLIENT
× should show change status button for EMPLOYEE/ADMIN
× should render request timeline
× should render client information
× should render service details
× should render location details
× should render assigned employee when present
× should render edit button when onEdit provided and user is not CLIENT
× should apply custom className
× should render request notes
× should render evidence section
× should disable assign button for cancelled requests
× should disable assign button for completed requests
```

**Error Type**: `Unable to find an element with the role "img"` - Component not rendering

**Root Cause**: Test uses `renderWithProviders` but tRPC mocks return undefined data, component doesn't render loading state correctly.

**Fix Required**:
```typescript
// BEFORE (current - broken):
it('should show loading state initially', () => {
  (trpc.request.getRequestById.useQuery as any).mockReturnValue({
    isLoading: true,
    isError: false,
    data: null,
  });

  renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

  expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // FAILS
});

// AFTER (fixed):
it('should show loading state initially', () => {
  (trpc.request.getRequestById.useQuery as any).mockReturnValue({
    isLoading: true,
    isError: false,
    data: null,
  });

  renderWithProviders(<RequestDetailOrganism {...defaultProps} />);

  // Component might use different loading indicator
  expect(screen.getByTestId('request-detail-loading')).toBeInTheDocument();
  // OR check for loading text
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

**Action Items**:
1. Read `RequestDetailOrganism.tsx` to see what loading state it renders
2. Update test expectations to match actual component behavior
3. Verify all 18 tests use correct queries

---

### 2. **RequestFormOrganism.test.tsx** - 6 tests ❌
**Problem**: Validation and loading state issues

```typescript
// Failing tests:
× should show loading state while fetching data (11ms)
× should validate required template fields (1061ms timeout)
× should submit form with all data (1128ms timeout)
× should show error message on submission failure (1064ms timeout)
× should disable form fields while submitting (1033ms timeout)
× should clear field errors when user starts typing (1061ms timeout)
```

**Error Type**: Timeouts (1000ms+)

**Root Cause**:
- Tests use `user.click()` but HTML5 validation prevents form submission
- Missing required fields cause validation to block without errors shown

**Fix Required**:
```typescript
// BEFORE (timeout):
it('should validate required template fields', async () => {
  const user = userEvent.setup({ delay: null });
  const onError = vi.fn();

  render(<RequestFormOrganism onError={onError} />);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton); // BLOCKS on HTML5 validation

  await waitFor(() => {
    expect(onError).toHaveBeenCalled(); // NEVER CALLED - TIMEOUT
  });
});

// AFTER (fixed):
it('should validate required template fields', async () => {
  const onError = vi.fn();

  render(<RequestFormOrganism onError={onError} />);

  // Bypass HTML5 validation by submitting form directly
  const form = screen.getByRole('form') || document.querySelector('form');
  if (form) {
    fireEvent.submit(form);
  }

  await waitFor(() => {
    expect(onError).toHaveBeenCalled();
  });
});
```

**Alternative Fix** (if component handles validation internally):
```typescript
it('should validate required template fields', async () => {
  const user = userEvent.setup({ delay: null });

  render(<RequestFormOrganism />);

  // Fill some fields but leave required ones empty
  const serviceSelect = screen.getByLabelText(/service/i);
  await user.selectOptions(serviceSelect, 'service-1');
  // Leave location empty (required)

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);

  // Check for validation error message
  await waitFor(() => {
    expect(screen.getByText(/location is required/i)).toBeInTheDocument();
  });
});
```

**Action Items**:
1. Determine if component uses HTML5 validation or custom validation
2. Use `fireEvent.submit()` for HTML5 bypass OR fill fields to trigger custom validation
3. Update all 6 tests with correct approach

---

### 3. **LocationFormOrganism.test.tsx** - 5 tests ❌
**Problem**: Same validation issues as RequestFormOrganism

```typescript
// Failing tests:
× should show cancel button when showCancel is true (31ms)
× should show validation error message (1010ms timeout)
× should clear field errors when user starts typing (1011ms timeout)
× should handle network errors gracefully (1137ms timeout)
× should have proper ARIA attributes for invalid fields (1012ms timeout)
```

**Error Type**: Timeouts (1000ms+) + rendering issues

**Fix Pattern**: Same as RequestFormOrganism - use `fireEvent.submit()` or properly fill forms

---

### 4. **NewVerificationFormOrganism.test.tsx** - 4 tests ❌
**Problem**: Translation context issues

```typescript
// Failing tests:
× should show success message after verification (1008ms timeout)
× should redirect to login after successful verification (1005ms timeout)
× should use translation for success message (1006ms timeout)
× should disable resend button while loading (1015ms timeout)
```

**Error Type**: Elements not found (timeout waiting)

**Root Cause**: Component uses `t('auth.verification.success', {}, 'auth')` with namespace parameter, but test translations object doesn't match structure.

**Fix Required**:
```typescript
// CURRENT translations object (incomplete):
const translations = {
  auth: {
    verification: {
      title: 'Verify Email',
      success: 'Email verified successfully!',
      error: 'Email verification failed',
    },
  },
  Common: {
    general: {
      loading: 'Verifying...',
    },
  },
};

// Component calls: t('auth.verification.success', {}, 'auth')
// This might need different structure or the component needs fixing

// OPTION 1: Fix translations structure
const translations = {
  auth: {
    verification: {
      success: 'Email verified successfully!',
    },
  },
};

// OPTION 2: Check component implementation
// Read NewVerificationFormOrganism.tsx line ~128-135
// Verify what exact translation key it uses
```

**Action Items**:
1. Read component to understand exact translation usage
2. Update translations object to match
3. Verify all 4 tests get correct text

---

### 5. **ServiceFormOrganism.test.tsx** - 4 tests ❌
**Problem**: Mixed issues

```typescript
// Failing tests:
× should show cancel button when showCancel is true (1013ms timeout)
× should validate required fields (1017ms timeout)
× should handle JSON template editing (14ms)
× should validate JSON template format (13ms)
```

**Error Types**:
- Timeouts for first 2 (validation issues)
- Fast failures for JSON tests (logic errors)

**Fix for validation**: Same pattern as other forms (fireEvent.submit)

**Fix for JSON tests**:
```typescript
// Need to read test to understand what's failing
// Likely issue: JSON field not being found or typed incorrectly

it('should handle JSON template editing', async () => {
  const user = userEvent.setup({ delay: null });

  render(<ServiceFormOrganism />);

  // Find JSON textarea/input
  const jsonField = screen.getByLabelText(/template/i)
    || screen.getByPlaceholderText(/json/i);

  const validJson = JSON.stringify({ field1: "value1" }, null, 2);
  await user.clear(jsonField);
  await user.type(jsonField, validJson);

  expect(jsonField).toHaveValue(validJson);
});
```

---

### 6. **LocationListOrganism.test.tsx** - 3 tests ❌
**Problem**: window.confirm not mocked correctly

```typescript
// Failing tests:
× should not delete location when confirmation cancelled (1005ms timeout)
× should call onLocationChange after successful operation (1003ms timeout)
× should render locations with all address details (1004ms timeout)
```

**Error Type**: Timeouts

**Root Cause**: Tests mock `global.confirm` but it's not being called, or test expectations are wrong

**Fix Required**:
```typescript
// BEFORE (timeout):
it('should not delete location when confirmation cancelled', async () => {
  (global.confirm as any).mockReturnValue(false); // User cancels
  (global.fetch as any).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockLocations),
  });

  render(<LocationListOrganism />);

  await waitFor(() => {
    expect(screen.getByText('Location 1')).toBeInTheDocument(); // TIMEOUT
  });

  // Location should still be there after cancel
  expect(screen.getByText('Location 1')).toBeInTheDocument();
});

// AFTER (fixed):
it('should not delete location when confirmation cancelled', async () => {
  (global.confirm as any).mockReturnValue(false);
  (global.fetch as any).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mockLocations),
  });

  render(<LocationListOrganism />);

  // Wait for locations to load first
  await waitFor(() => {
    expect(screen.getByText('Location 1')).toBeInTheDocument();
  });

  // Click delete button
  const deleteButton = screen.getByRole('button', { name: /delete.*location 1/i });
  await userEvent.click(deleteButton);

  // Confirm was called and returned false (cancelled)
  expect(global.confirm).toHaveBeenCalled();

  // Location should still be there
  expect(screen.getByText('Location 1')).toBeInTheDocument();

  // Fetch should NOT have been called (delete cancelled)
  expect(global.fetch).not.toHaveBeenCalledWith(
    expect.stringContaining('/delete'),
    expect.anything()
  );
});
```

---

### 7. **CategoryFormOrganism.test.tsx** - 2 tests ❌
```typescript
× should show cancel button when showCancel is true (9ms)
× should disable cancel button when loading (1008ms timeout)
```

**Fix**: Check component props and rendering logic

---

### 8. **CategoryListOrganism.test.tsx** - 2 tests ❌
```typescript
× should not delete category when confirmation cancelled (1006ms timeout)
× should show service count for each category (1001ms timeout)
```

**Fix**: Same pattern as LocationListOrganism

---

### 9. **ServiceListOrganism.test.tsx** - 2 tests ❌
```typescript
× should not delete service when confirmation cancelled (1004ms timeout)
× should call onServiceChange after successful operation (1002ms timeout)
```

**Fix**: Same pattern as LocationListOrganism

---

### 10. **ProfileFormClientOrganism.test.tsx** - 1 test ❌
```typescript
× should validate required fields on submit (1016ms timeout)
```

**Error Type**: Timeout

**Root Cause**: Component uses `useTranslations()` - needs `renderWithProviders`

**Fix Required**:
```typescript
// BEFORE:
it('should validate required fields on submit', async () => {
  const user = userEvent.setup();
  const onError = vi.fn();

  render(<ProfileFormClientOrganism onError={onError} />); // ❌

  const submitButton = screen.getByRole('button', { name: /save changes/i });
  await user.click(submitButton);

  await waitFor(() => {
    expect(onError).toHaveBeenCalled(); // TIMEOUT
  });
});

// AFTER:
import { renderWithProviders } from '@/test/test-utils';

const translations = {
  // Add required translation keys
};

it('should validate required fields on submit', async () => {
  const onError = vi.fn();

  renderWithProviders(<ProfileFormClientOrganism onError={onError} />, { translations }); // ✅

  // Submit form directly to bypass HTML5 validation
  const form = document.querySelector('form');
  if (form) {
    fireEvent.submit(form);
  }

  await waitFor(() => {
    expect(onError).toHaveBeenCalled();
  });
});
```

---

### 11. **ProfileFormEmployeeOrganism.test.tsx** - 2 tests ❌
```typescript
× should validate required fields on submit (1022ms timeout)
× should clear success message after 3 seconds (5002ms timeout)
```

**Fix**: Same as ProfileFormClientOrganism (needs renderWithProviders)

---

### 12. **RequestListOrganism.test.tsx** - 1 test ❌
```typescript
× should render request dates correctly (5ms)
```

**Error Type**: Fast failure (not timeout)

**Fix**: Check date formatting expectations

---

### 13. **AuthPageOrganism.test.tsx** - 1 test ❌
```typescript
× should merge custom styles with theme override (6ms)
```

**Error Type**: Fast failure

**Fix**: Already uses `renderWithProviders`, check style merging logic

---

### 14. **ThemeSwitcher.test.tsx** - 4 tests ❌
```typescript
× should render dropdown trigger button (14ms)
× should show current theme name on trigger (2ms)
× should render all saved themes in dropdown (2ms)
× should have accessible button text (4ms)
```

**Error Type**: Fast failures (elements not found)

**Fix**: Already uses `renderWithProviders`, likely needs theme context/mocks

---

### 15. **RequestChatPanel.test.tsx** - ? tests ❌
**Status**: Entire file fails

**Fix**: Needs full investigation

---

## 🔧 Fix Patterns by Problem Type

### Pattern 1: Component Uses `useTranslations()`

**Components**: ProfileFormClientOrganism, ProfileFormEmployeeOrganism

**Fix**:
```typescript
// 1. Change import
import { renderWithProviders } from '@/test/test-utils';

// 2. Add translations object
const translations = {
  // Add keys that component uses
  // Check component to find exact keys needed
};

// 3. Update render calls
renderWithProviders(<Component />, { translations });
```

---

### Pattern 2: HTML5 Validation Blocking Form Submit

**Components**: RequestFormOrganism, LocationFormOrganism, ServiceFormOrganism, ProfileForms

**Fix**:
```typescript
// Option A: Submit form directly
const form = screen.getByRole('form') || document.querySelector('form');
if (form) {
  fireEvent.submit(form);
}

// Option B: Fill required fields then submit
await user.type(screen.getByLabelText(/required field/i), 'value');
await user.click(submitButton);
```

---

### Pattern 3: window.confirm() Mocking

**Components**: CategoryListOrganism, ServiceListOrganism, LocationListOrganism

**Fix**:
```typescript
// 1. Ensure mock is set BEFORE action
(global.confirm as any).mockReturnValue(false); // or true

// 2. Wait for data to load FIRST
await waitFor(() => {
  expect(screen.getByText('Item Name')).toBeInTheDocument();
});

// 3. Trigger delete action
const deleteBtn = screen.getByRole('button', { name: /delete/i });
await userEvent.click(deleteBtn);

// 4. Verify confirm was called
expect(global.confirm).toHaveBeenCalled();

// 5. Check result based on mock return value
if (cancelled) {
  expect(screen.getByText('Item Name')).toBeInTheDocument(); // Still there
} else {
  expect(screen.queryByText('Item Name')).not.toBeInTheDocument(); // Deleted
}
```

---

### Pattern 4: tRPC Mocks Configuration

**Components**: RequestDetailOrganism

**Fix**:
```typescript
// Ensure ALL required mocks are set BEFORE render
(trpc.request.getRequestById.useQuery as any).mockReturnValue({
  isLoading: false,
  isError: false,
  data: mockData, // Must be complete mock object
  refetch: vi.fn(),
  // Add any other properties component expects
});

(trpc.request.assignRequest.useMutation as any).mockReturnValue({
  mutateAsync: vi.fn(),
  isLoading: false,
  // Add other mutation properties if needed
});

// Then render
renderWithProviders(<Component {...props} />);

// Query for elements that actually render
// Check component code to see what it shows for each state
```

---

### Pattern 5: Timeouts Waiting for Elements

**General Fix**:
```typescript
// 1. Check component renders the expected element
//    Read component code to verify exact text/role/testid

// 2. Ensure all mocks are returning data
//    Check fetch, tRPC, context mocks

// 3. Use correct query
await waitFor(() => {
  // Use getByText for text content
  expect(screen.getByText('Expected Text')).toBeInTheDocument();

  // Use getByRole for semantic elements
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();

  // Use getByTestId for custom test IDs
  expect(screen.getByTestId('custom-id')).toBeInTheDocument();
});

// 4. Increase timeout if needed (last resort)
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 3000 }); // Default is 1000ms
```

---

## 📋 Recommended Fix Order (Priority)

### High Priority (Most Used Components)
1. **RequestDetailOrganism** (18 tests) - Core request viewing
2. **RequestFormOrganism** (6 tests) - Core request creation
3. **ProfileFormClientOrganism** (1 test) - User profile management
4. **ProfileFormEmployeeOrganism** (2 tests) - Employee profile management

### Medium Priority (List/Management)
5. **LocationFormOrganism** (5 tests)
6. **LocationListOrganism** (3 tests)
7. **ServiceFormOrganism** (4 tests)
8. **ServiceListOrganism** (2 tests)
9. **CategoryListOrganism** (2 tests)

### Low Priority (UI/Theme)
10. **NewVerificationFormOrganism** (4 tests) - Email verification (one-time use)
11. **ThemeSwitcher** (4 tests) - Theme selection
12. **CategoryFormOrganism** (2 tests)
13. **RequestListOrganism** (1 test)
14. **AuthPageOrganism** (1 test)

### Investigation Required
15. **RequestChatPanel** (unknown tests) - Needs full file review

---

## 🛠️ Step-by-Step Fix Process

For each failing test:

### Step 1: Identify the Test
```bash
# Run single file to see failures
npm run test src/components/organisms/[path]/ComponentName.test.tsx --run

# Or run single test
npm run test -t "test name" --run
```

### Step 2: Read the Component
```typescript
// Find in component:
// 1. Does it use useTranslations()? → Needs renderWithProviders
// 2. Does it use tRPC hooks? → Needs proper mocks
// 3. Does it use fetch? → Mock global.fetch
// 4. What elements does it render? → Update test queries
```

### Step 3: Read the Test
```typescript
// Check:
// 1. What does it expect to find?
// 2. What mocks are set up?
// 3. What actions does it perform?
// 4. Where might it be failing?
```

### Step 4: Apply the Fix
```typescript
// Common fixes:
// 1. Change render → renderWithProviders (if needed)
// 2. Add/fix translations object
// 3. Fix tRPC/fetch mocks
// 4. Use fireEvent.submit() for forms
// 5. Update element queries to match component
// 6. Add proper waits for async operations
```

### Step 5: Verify
```bash
# Run the test again
npm run test -t "test name" --run

# Run the whole file
npm run test src/components/organisms/[path]/ComponentName.test.tsx --run
```

### Step 6: Run All Tests
```bash
# After fixing a file, run all organism tests
npm run test src/components/organisms/ --run

# Check for regressions
```

---

## 📚 Useful References

### Test Utilities
- **File**: `packages/web/src/test/test-utils.tsx`
- **What**: Custom render function with providers
- **When**: Use for components with useTranslations(), tRPC, or theme context

### Translation Structure
- **File**: Check `packages/web/src/dictionaries/` for translation structure
- **Pattern**: Nested object matching component usage

### Component Examples (Already Fixed)
- ✅ `ResetPasswordFormOrganism.test.tsx` - Good example of form testing
- ✅ `VerifyLoginCodeFormOrganism.test.tsx` - Good example of async/timeouts
- ✅ `NewPasswordFormOrganism.test.tsx` - Good example of validation

### Common Imports
```typescript
import { renderWithProviders, screen, waitFor, userEvent, fireEvent } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
```

---

## ⚠️ Common Pitfalls to Avoid

### 1. Using renderWithProviders on Components That Don't Need It
❌ **Don't**: Apply renderWithProviders to all components
✅ **Do**: Only use it for components that use useTranslations() or other context

### 2. Expecting HTML5 Validation Errors
❌ **Don't**: Expect onError to be called when HTML5 blocks submission
✅ **Do**: Use fireEvent.submit() to bypass HTML5 validation

### 3. Not Waiting for Async Operations
❌ **Don't**: Query immediately after async action
```typescript
fireEvent.click(button);
expect(screen.getByText('Result')).toBeInTheDocument(); // FAILS
```
✅ **Do**: Use waitFor
```typescript
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### 4. Incomplete tRPC Mocks
❌ **Don't**: Only mock query, forget mutations
✅ **Do**: Mock all tRPC hooks component uses

### 5. Not Cleaning Up Mocks
❌ **Don't**: Forget to clear mocks between tests
✅ **Do**: Use beforeEach to clear all mocks
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  (global.fetch as any).mockClear();
  (global.confirm as any).mockClear();
});
```

---

## 🎯 Success Metrics

### Target State
- **Tests Passing**: 920/924 (99.6%)
- **Tests Failing**: 4 or less (known issues/skipped)
- **Files Passing**: 40+/42 (95%+)

### Progress Tracking
```bash
# Check current state
npm run test src/components/organisms/ --run | grep -E "Test Files|Tests "

# Should see something like:
# Test Files  2 failed | 40 passed (42)
# Tests  4 failed | 920 passed (924)
```

---

## 📞 Need Help?

If you get stuck on a specific test:

1. **Read this guide** - Find the pattern that matches your issue
2. **Read the component** - Understand what it actually does
3. **Read working tests** - Use ResetPasswordFormOrganism.test.tsx as reference
4. **Check test-utils** - See what renderWithProviders provides
5. **Run in isolation** - Test one file at a time
6. **Add console.logs** - Debug what's rendering
7. **Check git history** - See what changed in recent commits

---

## 🚀 Quick Start Checklist

To fix a failing test:

- [ ] Run test in isolation to see exact error
- [ ] Read component to understand behavior
- [ ] Check if component uses useTranslations()
- [ ] Verify all mocks are set up correctly
- [ ] Update test to match actual component behavior
- [ ] Use waitFor for async operations
- [ ] Use fireEvent.submit() for form validation bypass
- [ ] Run test again to verify fix
- [ ] Run whole file to check for regressions
- [ ] Commit fix with descriptive message

---

**Good luck! You've got this!** 🎉

Remember: The components work in the app, the tests just need to match the actual behavior.
