import { UserRole, UserStatus } from '@prisma/client';

/**
 * JWT Payload Interface (ALI-115)
 * Defines the structure of data stored in JWT tokens
 *
 * Updated with new field names and profileComplete flag
 */
export interface JwtPayload {
  /** User email address */
  email: string;

  /** User ID (mapped to 'sub' in JWT standard) */
  sub: string;

  /** User role for authorization */
  role: UserRole;

  /** User first name (ALI-115 renamed from 'name') */
  firstname: string;

  /** User last name (ALI-115 renamed from 'lastName') */
  lastname: string;

  /** Profile completion status for onboarding flow (ALI-115) */
  profileComplete: boolean;

  /** Email verification status */
  emailVerified: boolean;

  /** Account status (PENDING, VERIFIED, SUSPENDED, ANONYMIZED) */
  status: UserStatus;

  /** Session active state - true if currently logged in */
  isActive: boolean;
}
