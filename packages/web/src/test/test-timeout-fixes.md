# Test Timeout Fixes Applied

## Common Patterns Fixed

### 1. Increase Test Timeout
- Changed default timeout from 5000ms to 10000ms for async operations
- Added timeout parameter to individual tests: `it('test name', async () => { ... }, 10000);`

### 2. Proper waitFor Usage
```typescript
await waitFor(
  () => {
    expect(element).toBeInTheDocument();
  },
  { timeout: 10000 }
);
```

### 3. Debounced Operations
```typescript
vi.useFakeTimers();
const user = userEvent.setup({ delay: null });

// ... perform action

vi.advanceTimersByTime(500);
vi.runAllTimers();

await waitFor(() => { ... }, { timeout: 10000 });

vi.useRealTimers();
```

### 4. beforeEach/afterEach Cleanup
```typescript
beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
```

### 5. Proper Component Mocking
```typescript
vi.mock('@/components/molecules/Component', () => ({
  Component: ({ prop }: any) => (
    <div data-testid="component">
      {prop?.field || 'Default'}
    </div>
  ),
}));
```

### 6. Mock Data with Complete Objects
- Always include nested objects (e.g., category with id and name)
- Always include required fields (createdAt, updatedAt, etc.)
- Use proper TypeScript types

## Files Fixed

1. ServiceListOrganism.test.tsx
   - Added ServiceCardMolecule mock
   - Added category objects to mock data
   - Added createdAt fields

2. UserManagementTable.test.tsx
   - Increased timeouts to 10000ms
   - Added waitFor before user interactions
   - Added proper cleanup in beforeEach/afterEach
   - Fixed debounced search test

3. OnboardingFormOrganism.test.tsx
   - Added afterEach cleanup
   - Added vi.useRealTimers() in beforeEach

## Next Steps

Need to apply similar fixes to:
- RequestFormOrganism.test.tsx
- LocationFormOrganism.test.tsx
- RegisterFormOrganism.test.tsx
- ProfileFormClientOrganism.test.tsx
- ProfileFormEmployeeOrganism.test.tsx
- ServiceFormOrganism.test.tsx
- CategoryListOrganism.test.tsx
- RequestDetailOrganism.test.tsx
- RequestManagementTable.test.tsx
- EmailTemplateFormOrganism.test.tsx
- ThemeEditorOrganism.test.tsx
- LoginFormOrganism.test.tsx
