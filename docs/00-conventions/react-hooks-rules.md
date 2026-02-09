# React Hooks Rules and Best Practices

**Created**: 2026-02-09
**Last Updated**: 2026-02-09
**Status**: Active Convention

## Overview

This document outlines critical rules for using React hooks correctly to prevent hydration errors and maintain consistent behavior across server-side rendering (SSR) and client-side rendering (CSR).

## Critical: Rules of Hooks

### Rule #1: Always Call Hooks at the Top Level

**❌ NEVER DO THIS:**

```typescript
function MyComponent() {
  const [count, setCount] = useState(0);

  if (someCondition) {
    return null; // ❌ Early return before other hooks
  }

  const [name, setName] = useState(''); // ❌ Hook after conditional return
  // ...
}
```

**✅ ALWAYS DO THIS:**

```typescript
function MyComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(''); // ✅ All hooks called before any returns

  if (someCondition) {
    return null; // ✅ Early return after all hooks
  }

  // ...
}
```

### Rule #2: Hooks Must Execute in Same Order Every Render

**Why This Matters:**
- React tracks hooks by their **call order**, not by variable names
- Different hook counts between renders causes "Expected static flag was missing" error
- Critical in React 19+ which has stricter hydration checks

### Rule #3: Never Call Hooks Conditionally

**❌ WRONG:**

```typescript
if (isLoggedIn) {
  const user = useUser(); // ❌ Conditional hook call
}
```

**✅ CORRECT:**

```typescript
const user = useUser(); // ✅ Always called

if (isLoggedIn) {
  // Use the user data conditionally
  console.log(user.name);
}
```

## Next.js 15/16 Specific Rules

### Rule #4: `useSearchParams()` Requires Suspense Boundary

In Next.js 15/16 with React 19, `useSearchParams()` **must** be wrapped in a Suspense boundary.

**❌ WRONG:**

```typescript
'use client';

export default function MyPage() {
  const searchParams = useSearchParams(); // ❌ No Suspense
  // ...
}
```

**✅ CORRECT:**

```typescript
'use client';

import { Suspense } from 'react';

function MyPageContent() {
  const searchParams = useSearchParams(); // ✅ Inside Suspense
  // ...
}

export default function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyPageContent />
    </Suspense>
  );
}
```

### Rule #5: Client-Only Queries for SSR/CSR Consistency

tRPC queries and other data-fetching hooks should be disabled during SSR to prevent hook mismatches.

**❌ WRONG:**

```typescript
function MyComponent() {
  const { data } = trpc.user.me.useQuery(); // ❌ Executes during SSR
  // ...
}
```

**✅ CORRECT:**

```typescript
function MyComponent() {
  const isClient = typeof window !== 'undefined';

  const { data } = trpc.user.me.useQuery(undefined, {
    enabled: isClient, // ✅ Only runs on client
  });
  // ...
}
```

## Common Patterns and Solutions

### Pattern 1: Conditional Rendering Based on Route

**❌ WRONG:**

```typescript
export function GlobalWidget() {
  const pathname = usePathname();

  if (pathname.includes('/admin')) {
    return null; // ❌ Early return before other hooks
  }

  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery(...);
  // ...
}
```

**✅ CORRECT:**

```typescript
export function GlobalWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // ✅ All hooks first
  const { data } = useQuery(...);

  if (pathname.includes('/admin')) {
    return null; // ✅ Early return after all hooks
  }

  // ...
}
```

### Pattern 2: Feature Flag Checks

**❌ WRONG:**

```typescript
export function FeatureComponent() {
  const { isEnabled } = useFeatureFlag('chat');

  if (!isEnabled) {
    return null; // ❌ Early return before other hooks
  }

  const [messages, setMessages] = useState([]);
  // ...
}
```

**✅ CORRECT:**

```typescript
export function FeatureComponent() {
  const { isEnabled } = useFeatureFlag('chat');
  const [messages, setMessages] = useState([]); // ✅ All hooks first

  if (!isEnabled) {
    return null; // ✅ Early return after all hooks
  }

  // ...
}
```

### Pattern 3: Authentication Checks

**❌ WRONG:**

```typescript
export function ProtectedComponent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPrompt />; // ❌ Early return before other hooks
  }

  const { data } = useQuery(...);
  // ...
}
```

**✅ CORRECT:**

```typescript
export function ProtectedComponent() {
  const { user } = useAuth();
  const { data } = useQuery(...); // ✅ All hooks first

  if (!user) {
    return <LoginPrompt />; // ✅ Early return after all hooks
  }

  // ...
}
```

## Debugging Hook Issues

### Symptoms of Hook Violations

1. **Error Message**: "Expected static flag was missing"
2. **Error Location**: Usually in `RootLayout` or global components
3. **Occurrence**: Happens in React 19+ with stricter hydration checks
4. **Trigger**: Different hook call orders between SSR and CSR

### How to Identify the Problem

1. **Check Component Stack**: Error traceback shows which component
2. **Look for Early Returns**: Search for `return` statements before all hooks are called
3. **Check Conditional Hooks**: Look for hooks inside `if` statements
4. **Verify Global Components**: Check components rendered in `layout.tsx`

### Quick Fixes Checklist

- [ ] Move all hooks to the top of the component
- [ ] Ensure all hooks are called before any `return` statements
- [ ] Remove conditional hook calls
- [ ] Wrap `useSearchParams()` in Suspense
- [ ] Add `enabled: isClient` to tRPC queries
- [ ] Clear `.next` cache: `rm -rf packages/web/.next`

## Real-World Examples from This Project

### Example 1: ChatWidget Fix

**Before (Broken):**

```typescript
export function ChatWidget() {
  const pathname = usePathname();

  if (isPrivateRoute) {
    return null; // ❌ Exits before other hooks
  }

  const [isOpen, setIsOpen] = useState(false);
  const { data } = trpc.config.useQuery();
  // ... 15+ more hooks
}
```

**After (Fixed):**

```typescript
export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // ✅ All hooks first
  const { data } = trpc.config.useQuery();
  // ... all hooks called unconditionally

  if (isPrivateRoute) {
    return null; // ✅ Early return after all hooks
  }

  // ...
}
```

### Example 2: Feature-Disabled Page Fix

**Before (Broken):**

```typescript
export default function FeatureDisabledPage() {
  const searchParams = useSearchParams(); // ❌ No Suspense
  // ...
}
```

**After (Fixed):**

```typescript
function FeatureDisabledContent() {
  const searchParams = useSearchParams(); // ✅ Inside Suspense
  // ...
}

export default function FeatureDisabledPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FeatureDisabledContent />
    </Suspense>
  );
}
```

### Example 3: Theme Context Fix

**Before (Broken):**

```typescript
export function useThemeAuth() {
  const { data } = trpc.user.me.useQuery(); // ❌ Runs during SSR
  // ...
}
```

**After (Fixed):**

```typescript
export function useThemeAuth() {
  const isClient = typeof window !== 'undefined';

  const { data } = trpc.user.me.useQuery(undefined, {
    enabled: isClient, // ✅ Client-only
  });
  // ...
}
```

## Testing for Hook Violations

### Manual Testing

1. Clear Next.js cache: `rm -rf packages/web/.next`
2. Start dev server: `npm run dev`
3. Navigate to different routes (public and private)
4. Check browser console for hydration errors
5. Test SSR vs CSR by viewing page source

### Automated Testing

Add ESLint rule to catch hook violations:

```json
{
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## Performance Considerations

### Impact of Unconditional Hooks

**Question**: "Won't calling all hooks slow down my component?"

**Answer**: No, because:
- React hooks are **very fast** (microseconds)
- Early returns happen **after** hooks but **before** rendering JSX
- Modern React optimizes unused state

**Example Performance:**

```typescript
function MyComponent() {
  // These all execute in < 1ms total
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  if (shouldExit) {
    return null; // Exits before expensive rendering
  }

  // Expensive rendering only happens if not exited early
  return <ComplexComponent />;
}
```

## Related Documentation

- [React Hooks Rules (Official)](https://react.dev/reference/react/hooks#rules-of-hooks)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19)
- `/docs/00-conventions/atomic-design-architecture.md` - Component structure
- `/docs/05-testing/frontend-testing-guide.md` - Testing best practices

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-09 | Initial document created after fixing ChatWidget hook violation | Claude Sonnet 4.5 |

## Contributors

- Claude Sonnet 4.5 (AI Assistant)
- Alkitu Development Team

---

**Remember**: When in doubt, call all hooks at the top of your component, before any conditional logic or early returns!
