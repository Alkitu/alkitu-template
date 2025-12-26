/**
 * Decode JWT token to extract payload
 * Works in browser environment
 */
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

export function decodeJWT(token: string): JWTPayload | null {
  try {
    // Split the token to get the payload (middle part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64 to JSON string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Get user ID from JWT token stored in cookies
 * This is a client-side utility
 */
export function getUserIdFromToken(): string | null {
  if (typeof document === 'undefined') {
    return null; // Not in browser
  }

  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const token = cookies['auth-token'];
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.sub || null;
}

/**
 * Get full user data from JWT token
 */
export function getUserFromToken(): JWTPayload | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

  const token = cookies['auth-token'];
  if (!token) return null;

  return decodeJWT(token);
}
