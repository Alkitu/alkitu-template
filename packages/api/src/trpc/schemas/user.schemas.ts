import { z } from 'zod';

/**
 * User tRPC Schemas
 *
 * This file contains all Zod validation schemas for user-related tRPC endpoints.
 * Schemas are extracted from inline definitions for better reusability,
 * testing, and maintainability.
 */

/**
 * User Registration Schema
 * Used for creating new user accounts
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']).optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

/**
 * Update Profile Schema
 * Used for updating user profile information
 */
export const updateProfileSchema = z.object({
  id: z.string(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']).optional(),
});

/**
 * Get User by Email Schema
 * Used for fetching user by email address
 */
export const getUserByEmailSchema = z.object({
  email: z.string().email(),
});

/**
 * Get Filtered Users Schema
 * Used for fetching users with filters and pagination
 */
export const getFilteredUsersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']).optional(),
  teamOnly: z.boolean().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z
    .enum(['email', 'firstname', 'lastname', 'createdAt', 'lastLogin'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Bulk Delete Users Schema
 * Used for deleting multiple users at once (ADMIN only)
 */
export const bulkDeleteUsersSchema = z.object({
  userIds: z.array(z.string()),
});

/**
 * Bulk Update Role Schema
 * Used for updating role for multiple users (ADMIN only)
 */
export const bulkUpdateRoleSchema = z.object({
  userIds: z.array(z.string()),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']),
});

/**
 * Bulk Update Status Schema
 * Used for updating status for multiple users (ADMIN only)
 */
export const bulkUpdateStatusSchema = z.object({
  userIds: z.array(z.string()),
  isActive: z.boolean(),
});

/**
 * Reset User Password Schema
 * Used for admin-initiated password reset
 */
export const resetUserPasswordSchema = z.object({
  userId: z.string(),
  sendEmail: z.boolean().default(true),
});

/**
 * Admin Change Password Schema
 * Used for admin to change user password directly
 */
export const adminChangePasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Send Message to User Schema
 * Used for admin to send message to specific user
 */
export const sendMessageToUserSchema = z.object({
  userId: z.string(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message too long'),
});

/**
 * Anonymize User Schema
 * Used for GDPR compliance - anonymize user data
 */
export const anonymizeUserSchema = z.object({
  userId: z.string(),
});

/**
 * Create Impersonation Token Schema
 * Used for admin to impersonate another user for support purposes
 */
export const createImpersonationTokenSchema = z.object({
  adminId: z.string(),
  targetUserId: z.string(),
});

/**
 * Change My Password Schema
 * Used for authenticated users to change their own password
 */
export const changeMyPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(50, 'Password must not exceed 50 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Update My Profile Schema
 * Used for authenticated users to update their own profile
 */
export const updateMyProfileSchema = z.object({
  firstname: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .optional(),
  lastname: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
  contactPerson: z
    .object({
      name: z.string().min(1, 'Name is required'),
      lastname: z.string().min(1, 'Last name is required'),
      phone: z.string().min(1, 'Phone is required'),
      email: z.string().email('Invalid email format'),
    })
    .optional(),
});

/**
 * Update My Preferences Schema
 * Used for authenticated users to update their display preferences
 */
export const updateMyPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['es', 'en']),
});

/**
 * Ensure User Drive Folders Schema
 * Used for admin to ensure a user's Drive folders exist (or create them)
 */
export const ensureUserDriveFoldersSchema = z.object({
  userId: z.string(),
});

/**
 * Update User Drive Folder ID Schema
 * Used for admin to manually link a user to a different Drive folder
 */
export const updateUserDriveFolderIdSchema = z.object({
  userId: z.string(),
  driveFolderId: z.string().min(1, 'Drive folder ID is required'),
});

/**
 * Type exports for TypeScript consumers
 * These can be used in services, controllers, etc.
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>;
export type GetFilteredUsersInput = z.infer<typeof getFilteredUsersSchema>;
export type BulkDeleteUsersInput = z.infer<typeof bulkDeleteUsersSchema>;
export type BulkUpdateRoleInput = z.infer<typeof bulkUpdateRoleSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
export type AdminChangePasswordInput = z.infer<
  typeof adminChangePasswordSchema
>;
export type SendMessageToUserInput = z.infer<typeof sendMessageToUserSchema>;
export type AnonymizeUserInput = z.infer<typeof anonymizeUserSchema>;
export type CreateImpersonationTokenInput = z.infer<
  typeof createImpersonationTokenSchema
>;
export type ChangeMyPasswordInput = z.infer<typeof changeMyPasswordSchema>;
export type UpdateMyProfileInput = z.infer<typeof updateMyProfileSchema>;
export type UpdateMyPreferencesInput = z.infer<
  typeof updateMyPreferencesSchema
>;
export type EnsureUserDriveFoldersInput = z.infer<
  typeof ensureUserDriveFoldersSchema
>;
export type UpdateUserDriveFolderIdInput = z.infer<
  typeof updateUserDriveFolderIdSchema
>;
