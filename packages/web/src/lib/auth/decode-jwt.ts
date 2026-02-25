export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  firstname?: string;
  lastname?: string;
  profileComplete?: boolean;
  emailVerified?: boolean;
  iat: number;
  exp: number;
}

/**
 * Decode a JWT token payload WITHOUT verifying the signature.
 *
 * WARNING: This function does NOT verify the JWT signature.
 * Do NOT use this for authorization decisions (e.g., role checks, route protection).
 * For authorization, use `verifyJWT()` from `@/lib/auth/verify-jwt.ts` instead.
 *
 * Safe uses: displaying user info in the UI, reading non-sensitive claims client-side.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
