# Authentication Security Patterns

## JWT Verification

### Rule: Always use `verifyJWT()` for authorization decisions

- **Server-side (middleware, API routes)**: Use `verifyJWT()` from `@/lib/auth/verify-jwt.ts`
- **Client-side (UI display only)**: Use `decodeJWT()` from `@/lib/auth/decode-jwt.ts`

### Anti-patterns

```ts
// NEVER do this for authorization:
const base64Url = token.split('.')[1];
const payload = JSON.parse(atob(base64Url));
if (payload.role === 'ADMIN') { /* grant access */ }

// ALWAYS do this instead:
const payload = await verifyJWT(token);
if (!payload) { /* redirect to login */ }
```

### Why

`atob()` decoding only reads the payload — it does NOT verify the cryptographic signature. An attacker can craft a JWT with `role: "ADMIN"` using `btoa()` and bypass all role checks. `verifyJWT()` uses `jose.jwtVerify()` with HS256 to validate the signature against `JWT_SECRET`.

---

## Cookie Standards

### Rule: Use constants from `@/lib/auth/constants.ts`

| Constant | Value | Description |
|---|---|---|
| `AUTH_TOKEN_COOKIE` | `'auth-token'` | Access token cookie name |
| `REFRESH_TOKEN_COOKIE` | `'refresh-token'` | Refresh token cookie name |
| `ACCESS_TOKEN_MAX_AGE` | `86400` (24h) | Access token lifetime |
| `REFRESH_TOKEN_MAX_AGE` | `604800` (7d) | Refresh token lifetime |
| `AUTH_COOKIE_OPTIONS` | `{ httpOnly, secure, sameSite, path }` | Shared options |

### Rules

- Cookie names use **hyphens** (`auth-token`), NOT underscores (`access_token`)
- Always import constants instead of hardcoding strings
- All auth cookies MUST be `httpOnly: true`
- `secure: true` in production only (`process.env.NODE_ENV === 'production'`)

### Anti-patterns

```ts
// WRONG: hardcoded names, inconsistent format
response.cookies.set('access_token', token, { maxAge: 900 });

// CORRECT: use constants
import { AUTH_TOKEN_COOKIE, AUTH_COOKIE_OPTIONS, ACCESS_TOKEN_MAX_AGE } from '@/lib/auth/constants';
response.cookies.set(AUTH_TOKEN_COOKIE, token, {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: ACCESS_TOKEN_MAX_AGE,
});
```

---

## Logging Rules

### Rule: Never log tokens, passwords, or sensitive payloads

- Use the structured `logger` from `@/lib/logger.ts`
- Log **what happened**, not **the data**

### Safe to log

- Path, clean path, required roles, user role
- Redirect destinations
- Boolean flags: `hasAccessToken: !!token`
- Error messages: `error.message` (never the full error object)

### Never log

- JWT tokens (access or refresh)
- Cookie values
- Decoded payloads
- Passwords or hashed passwords
- Full request headers

### Anti-patterns

```ts
// WRONG: leaks credentials
console.log('Token:', authCookie.value);
console.log('Payload:', JSON.parse(atob(token.split('.')[1])));
console.log('Login response:', data); // contains tokens

// CORRECT: structured, safe logging
logger.debug('[AUTH] Token verified', { role: payload.role });
logger.debug('Login successful', { hasAccessToken: !!data.access_token });
```

---

## Password Hashing

### Rule: Use the shared `BCRYPT_SALT_ROUNDS` constant

```ts
import { BCRYPT_SALT_ROUNDS } from '@alkitu/shared';
const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS); // 12 rounds
```

- The standard is **12 salt rounds** (defined in `packages/shared/src/constants/security.ts`)
- Existing passwords hashed with different rounds still work (bcrypt embeds rounds in the hash)
- Never hardcode salt rounds — always use the shared constant

---

## JWT_SECRET Configuration

- `JWT_SECRET` is a **server-side only** environment variable
- It MUST match between `packages/api` and `packages/web`
- Never use the `NEXT_PUBLIC_` prefix (would expose the secret to the browser)
- If `JWT_SECRET` is not configured, `verifyJWT()` returns `null` (fail-closed)

---

## Fail-Closed Design

All security checks default to **denying access** when something goes wrong:

- Missing `JWT_SECRET` → treat as unauthenticated → redirect to login
- Invalid JWT signature → treat as unauthenticated → redirect to login
- Expired token → attempt refresh → if refresh fails → redirect to login
- Missing role in token → treat as unauthenticated → redirect to login

Never fail-open (granting access when validation fails).
