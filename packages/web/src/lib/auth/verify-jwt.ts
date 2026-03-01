import { jwtVerify, type JWTPayload as JoseJWTPayload } from 'jose';
import { logger } from '@/lib/logger';

export interface VerifiedJWTPayload extends JoseJWTPayload {
  sub: string;
  email: string;
  role: string;
  firstname?: string;
  lastname?: string;
  status?: string;
  profileComplete?: boolean;
  emailVerified?: boolean;
  provider?: string;
}

/**
 * Verify a JWT token using jose (Edge Runtime compatible).
 * Uses HS256 with the server-side JWT_SECRET environment variable.
 *
 * Fail-closed: returns null if verification fails for any reason
 * (missing secret, invalid signature, expired token, malformed token).
 */
export async function verifyJWT(
  token: string,
): Promise<VerifiedJWTPayload | null> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    logger.error('[verifyJWT] JWT_SECRET is not configured');
    return null;
  }

  try {
    const encodedSecret = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encodedSecret, {
      algorithms: ['HS256'],
    });

    // Ensure required fields are present
    if (!payload.sub || !payload.role) {
      logger.warn('[verifyJWT] Token missing required fields (sub or role)');
      return null;
    }

    return payload as VerifiedJWTPayload;
  } catch {
    // Fail-closed: any verification failure returns null
    // Do NOT log the token itself — only that verification failed
    logger.debug('[verifyJWT] Token verification failed');
    return null;
  }
}
