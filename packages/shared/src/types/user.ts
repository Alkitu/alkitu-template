// Import and re-export UserRole
import { UserRole } from '../enums/user-role.enum';
export { UserRole };

/**
 * User Status Enum (Account Status)
 * Must match Prisma schema
 *
 * - PENDING: User registered but email not verified OR profile incomplete
 * - VERIFIED: Email verified AND profile complete (replaces ACTIVE)
 * - SUSPENDED: Account blocked by admin
 * - ANONYMIZED: Data anonymized for GDPR compliance (irreversible)
 */
export enum UserStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED",
  ANONYMIZED = "ANONYMIZED",
}

/**
 * Contact person information for business clients (ALI-115)
 */
export interface ContactPerson {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

/**
 * User model with ALI-115 updates
 *
 * Field naming changes:
 * - name → firstname
 * - lastName → lastname
 * - contactNumber → phone
 *
 * New fields:
 * - company
 * - address
 * - contactPerson
 * - profileComplete
 */
export interface User {
  id: string;
  email: string;
  firstname: string; // Renamed from "name"
  lastname: string; // Renamed from "lastName"
  phone?: string; // Renamed from "contactNumber"
  company?: string; // New field
  address?: string; // New field
  contactPerson?: ContactPerson; // New field
  role: UserRole;
  status: UserStatus; // Account status (PENDING, VERIFIED, etc.)
  profileComplete: boolean; // New field - indicates if onboarding is completed
  emailVerified?: Date;
  image?: string;
  terms: boolean;
  isTwoFactorEnabled: boolean;
  isActive: boolean; // Session state - true if currently logged in
  lastActivity?: Date; // Last activity timestamp (updated on login/logout)
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

/**
 * JWT Payload with ALI-115 updates
 */
export interface JwtPayload {
  email: string;
  sub: string; // userId
  role: UserRole;
  profileComplete: boolean; // New field (ALI-115)
  firstname: string; // New field (ALI-115)
  lastname: string; // New field (ALI-115)
  emailVerified: boolean; // Security flag from backend (ALI-115)
  status: UserStatus; // Account status (PENDING, VERIFIED, etc.)
  isActive: boolean; // Session active state
  iat?: number;
  exp?: number;
}

/**
 * Auth response with updated user data
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: UserRole;
    profileComplete: boolean;
    emailVerified: boolean; // ALI-115 - From backend auth.service.ts
  };
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
