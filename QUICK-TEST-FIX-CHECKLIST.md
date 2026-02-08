# Quick Test Fix Checklist

**Use this as a quick reference while fixing tests. See ORGANISM-TESTS-FIX-GUIDE.md for detailed explanations.**

---

## 🎯 Quick Diagnosis

### Symptom → Fix

| Error Message | Fix |
|--------------|-----|
| `Unable to find element` + timeout | Component not rendering → Check mocks/providers |
| `expected "spy" to be called` + timeout | HTML5 validation blocking → Use `fireEvent.submit()` |
| `Unable to find element` + fast (< 100ms) | Wrong query → Check component for actual elements |
| Timeout waiting for text | Translation missing → Add to translations object |
| tRPC hook error | Mock incomplete → Add all hook return values |

---

## 📋 File-by-File Quick Fixes

### RequestDetailOrganism (18 tests)
```typescript
// Problem: tRPC mocks incomplete
// Fix: Read component, update test queries to match actual rendering
// Check: What loading state does component actually show?
```

### RequestFormOrganism (6 tests)
```typescript
// Problem: HTML5 validation blocking
// Fix:
const form = document.querySelector('form');
if (form) fireEvent.submit(form);
```

### LocationFormOrganism (5 tests)
```typescript
// Problem: Same as RequestFormOrganism
// Fix: fireEvent.submit() OR fill required fields
```

### NewVerificationFormOrganism (4 tests)
```typescript
// Problem: Translation structure mismatch
// Fix: Read component for exact t() calls, match translations object
```

### ServiceFormOrganism (4 tests)
```typescript
// Problem: 2 validation (HTML5) + 2 JSON field errors
// Fix: fireEvent.submit() + check JSON textarea query
```

### LocationListOrganism (3 tests)
```typescript
// Problem: confirm() not triggering correctly
// Fix:
await waitFor(() => expect(screen.getByText('Item')).toBeInTheDocument());
const deleteBtn = screen.getByRole('button', { name: /delete/i });
await userEvent.click(deleteBtn);
expect(global.confirm).toHaveBeenCalled();
```

### ProfileFormClientOrganism (1 test)
```typescript
// Problem: Needs renderWithProviders
// Fix:
import { renderWithProviders } from '@/test/test-utils';
renderWithProviders(<Component />, { translations });
```

### ProfileFormEmployeeOrganism (2 tests)
```typescript
// Problem: Same as ProfileFormClient + timeout test
// Fix: renderWithProviders + check timer logic for success message
```

### CategoryListOrganism (2 tests)
```typescript
// Problem: confirm() + element not found
// Fix: Same as LocationListOrganism
```

### ServiceListOrganism (2 tests)
```typescript
// Problem: confirm() + callback not called
// Fix: Same as LocationListOrganism
```

### CategoryFormOrganism (2 tests)
```typescript
// Problem: Button not showing
// Fix: Check showCancel prop usage in component
```

### ThemeSwitcher (4 tests)
```typescript
// Problem: Elements not found (already uses renderWithProviders)
// Fix: Add theme context mocks
```

### RequestListOrganism (1 test)
```typescript
// Problem: Date formatting
// Fix: Check component date display logic
```

### AuthPageOrganism (1 test)
```typescript
// Problem: Style merging
// Fix: Check theme override logic
```

### RequestChatPanel (? tests)
```typescript
// Problem: Unknown - full file fails
// Fix: Run test to see errors, then investigate
```

---

## 🔧 Common Fix Patterns (Copy-Paste)

### Pattern 1: Add renderWithProviders
```typescript
// Add to imports
import { renderWithProviders } from '@/test/test-utils';

// Add translations
const translations = {
  // Check component for keys
};

// Replace render
renderWithProviders(<Component />, { translations });
```

### Pattern 2: Bypass HTML5 Validation
```typescript
// Instead of clicking submit button
const form = document.querySelector('form');
if (form) {
  fireEvent.submit(form);
}

// OR fill required fields
await userEvent.type(screen.getByLabelText(/name/i), 'Test');
await userEvent.click(submitButton);
```

### Pattern 3: Fix confirm() Tests
```typescript
(global.confirm as any).mockReturnValue(false); // Cancel

// Wait for data to load
await waitFor(() => {
  expect(screen.getByText('Item')).toBeInTheDocument();
});

// Click delete
const deleteBtn = screen.getByRole('button', { name: /delete.*item/i });
await userEvent.click(deleteBtn);

// Verify
expect(global.confirm).toHaveBeenCalled();
expect(screen.getByText('Item')).toBeInTheDocument(); // Still there
```

### Pattern 4: Fix tRPC Mocks
```typescript
// Before render, mock ALL hooks
(trpc.entity.query.useQuery as any).mockReturnValue({
  isLoading: false,
  isError: false,
  data: mockData,
  refetch: vi.fn(),
});

(trpc.entity.mutation.useMutation as any).mockReturnValue({
  mutateAsync: vi.fn(),
  isLoading: false,
});

// Then render
renderWithProviders(<Component />);
```

### Pattern 5: Fix Async Waits
```typescript
// Always wrap expectations in waitFor
await waitFor(() => {
  expect(screen.getByText('Expected')).toBeInTheDocument();
});

// For user actions
await userEvent.click(button);
await waitFor(() => {
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

---

## ⚡ Speed Run Workflow

For each failing test:

1. **Run it**: `npm run test -t "test name" --run`
2. **Read error**: Identify pattern from table above
3. **Read component**: Find what it actually renders
4. **Apply fix**: Use pattern from this doc
5. **Verify**: Re-run test
6. **Check file**: Run whole file to catch regressions
7. **Next**: Move to next test

---

## 🎯 Priority Order

Fix in this order for maximum impact:

1. RequestDetailOrganism (18) - Most tests
2. RequestFormOrganism (6) - High usage
3. LocationFormOrganism (5) - High usage
4. ServiceFormOrganism (4) - High usage
5. NewVerificationFormOrganism (4) - Partial work done
6. LocationListOrganism (3)
7. ProfileFormEmployee (2)
8. ProfileFormClient (1) - Quick win
9. Others as needed

---

## 🚨 Before You Commit

```bash
# Run all organism tests
npm run test src/components/organisms/ --run

# Should see improvement
# Target: < 10 failing tests

# Commit with good message
git add .
git commit -m "test: fix [component] organism tests - [what you fixed]"
```

---

## 💡 Pro Tips

- Fix tests in same component together (similar issues)
- Use `screen.debug()` to see what's rendering
- Check `ResetPasswordFormOrganism.test.tsx` for examples
- Test one file at a time to avoid confusion
- Git commit after each file to track progress

---

**Need details? Check ORGANISM-TESTS-FIX-GUIDE.md**
