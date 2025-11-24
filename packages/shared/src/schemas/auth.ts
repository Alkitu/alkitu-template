import { z } from 'zod';

/**
 * Password validation schema with ALI-115 complexity requirements
 */
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(50, 'Password must not exceed 50 characters')
  .regex(/[A-Z]/, 'Must include at least one uppercase letter')
  .regex(/[a-z]/, 'Must include at least one lowercase letter')
  .regex(/[0-9]/, 'Must include at least one number');

/**
 * Contact person schema (ALI-115)
 */
export const ContactPersonSchema = z.object({
  name: z.string().min(2, 'Minimum 2 characters'),
  lastname: z.string().min(2, 'Minimum 2 characters'),
  phone: z.string().min(1, 'Phone required'),
  email: z.string().email('Invalid email'),
});

/**
 * User registration schema with ALI-115 updates
 * - Renamed: name → firstname, lastName → lastname
 * - Updated: password complexity requirements
 * - Removed: contactNumber (collected in onboarding)
 */
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  password: PasswordSchema,
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

/**
 * User registration with password confirmation
 */
export const RegisterSchema = CreateUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Update user schema with ALI-115 updates
 */
export const UpdateUserSchema = z.object({
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
  contactPerson: ContactPersonSchema.optional(),
  profileComplete: z.boolean().optional(),
});

/**
 * Onboarding schema - additional profile fields (ALI-115)
 */
export const OnboardingSchema = z.object({
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  contactPerson: ContactPersonSchema.optional(),
});

/**
 * Update profile schema (ALI-116)
 * User self-service profile update (more restrictive than UpdateUserSchema)
 * Does NOT allow: email, password, role, status, profileComplete
 */
export const UpdateProfileSchema = z.object({
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
  address: z.string().optional(), // Only for CLIENT role (validated in backend)
  contactPerson: ContactPersonSchema.optional(), // Only for CLIENT role (validated in backend)
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const UsersFilterSchema = z.object({
  search: z.string().optional(),
  role: z
    .enum(['ADMIN', 'CLIENT', 'EMPLOYEE', 'USER', 'MODERATOR', 'LEAD'])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Type inference
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;
export type UsersFilterInput = z.infer<typeof UsersFilterSchema>;
export type ContactPersonInput = z.infer<typeof ContactPersonSchema>;
