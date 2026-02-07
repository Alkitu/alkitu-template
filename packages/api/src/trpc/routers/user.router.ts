import { z } from 'zod';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { t } from '../trpc';
import { UserStatus, UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UpdateProfileDto } from '../../users/dto/update-profile.dto';
import { FilterUsersDto } from '../../users/dto/filter-users.dto';
import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
  AdminResetPasswordDto,
} from '../../users/dto/bulk-users.dto';

// --- Zod Schemas ---

const registerSchema = z.object({
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

const updateProfileSchema = z.object({
  id: z.string(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']).optional(),
});

const getUserByEmailSchema = z.object({ email: z.string().email() });

const getFilteredUsersSchema = z.object({
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

const bulkDeleteUsersSchema = z.object({ userIds: z.array(z.string()) });

const bulkUpdateRoleSchema = z.object({
  userIds: z.array(z.string()),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']),
});

const bulkUpdateStatusSchema = z.object({
  userIds: z.array(z.string()),
  isActive: z.boolean(),
});

const resetUserPasswordSchema = z.object({
  userId: z.string(),
  sendEmail: z.boolean().default(true),
});

const adminChangePasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

const sendMessageToUserSchema = z.object({
  userId: z.string(),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message too long'),
});

const anonymizeUserSchema = z.object({ userId: z.string() });

const createImpersonationTokenSchema = z.object({
  adminId: z.string(),
  targetUserId: z.string(),
});

// --- Router ---

export const createUserRouter = (
  usersService: UsersService,
  emailService: EmailService,
) =>
  t.router({
    me: t.procedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      try {
        return await usersService.findOne(ctx.user.id);
      } catch (error) {
        console.error('[UserRouter] Me query failed:', error);
        return null;
      }
    }),

    register: t.procedure.input(registerSchema).mutation(async ({ input }) => {
      try {
        // Map fields from TRPC input to UsersService/Prisma expected fields
        const createDto = {
          email: input.email,
          password: input.password,
          firstname: input.firstname,
          lastname: input.lastname,
          phone: input.phone,
          role: input.role,
          terms: input.terms,
        };

        const user = await usersService.create(createDto);

        // Send welcome email
        try {
          const frontendUrl =
            process.env.FRONTEND_URL || 'http://localhost:3000';

          await emailService.sendWelcomeEmail({
            userName: `${user.firstname} ${user.lastname}`.trim() || 'Usuario',
            userEmail: user.email,
            registrationDate: new Date().toLocaleDateString('es-ES'),
            loginUrl: `${frontendUrl}/login`,
            unsubscribeUrl: `${frontendUrl}/unsubscribe`,
            supportUrl: `${frontendUrl}/support`,
          });

          console.log('✅ Email de bienvenida enviado a:', user.email);
        } catch (emailError) {
          const errorMessage =
            emailError instanceof Error ? emailError.message : 'Unknown error';
          console.error('❌ Error enviando email de bienvenida:', errorMessage);
          // No fallar el registro si el email falla
        }

        return {
          success: true,
          message: 'User registered successfully. Welcome email sent!',
          user,
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Registration failed';
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: errorMessage,
          cause: error,
        });
      }
    }),

    updateProfile: t.procedure
      .input(updateProfileSchema)
      .mutation(async ({ input }) => {
        try {
          const updateDto = {
            firstname: input.firstname,
            lastname: input.lastname,
            phone: input.phone,
            role: input.role,
          };
          const updatedUser = await usersService.updateProfile(
            input.id,
            updateDto,
          );

          console.log(`[UserRouter] Profile updated for user ${input.id}`);

          return {
            id: updatedUser.id,
            name: updatedUser.firstname,
            lastName: updatedUser.lastname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            message: 'Profile updated successfully',
          };
        } catch (error) {
          console.error(
            `[UserRouter] Failed to update profile for ${input.id}:`,
            error,
          );
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update profile',
            cause: error,
          });
        }
      }),

    getAllUsers: t.procedure.query(async () => {
      try {
        return await usersService.findAll();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
          cause: error,
        });
      }
    }),

    getUserByEmail: t.procedure
      .input(getUserByEmailSchema)
      .query(async ({ input }) => {
        try {
          return await usersService.findByEmail(input.email);
        } catch (error) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
            cause: error,
          });
        }
      }),

    getFilteredUsers: t.procedure
      .input(getFilteredUsersSchema)
      .query(async ({ input }) => {
        try {
          // Construct filter DTO explicitly to avoid any casting
          const filterDto: FilterUsersDto = {
            ...input,
            role: input.role as UserRole | undefined,
            sortOrder: input.sortOrder,
          };

          return await usersService.findAllWithFilters(filterDto);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to filter users',
            cause: error,
          });
        }
      }),

    getUserStats: t.procedure.query(async () => {
      return usersService.getUserStats();
    }),

    bulkDeleteUsers: t.procedure
      .input(bulkDeleteUsersSchema)
      .mutation(async ({ input }) => {
        return usersService.bulkDeleteUsers(input as BulkDeleteUsersDto);
      }),

    bulkUpdateRole: t.procedure
      .input(bulkUpdateRoleSchema)
      .mutation(async ({ input }) => {
        return usersService.bulkUpdateRole({
          userIds: input.userIds,
          role: input.role as UserRole,
        } as BulkUpdateRoleDto);
      }),

    bulkUpdateStatus: t.procedure
      .input(bulkUpdateStatusSchema)
      .mutation(async ({ input }) => {
        // Convert isActive boolean to UserStatus enum
        const statusDto: BulkUpdateStatusDto = {
          userIds: input.userIds,
          status: input.isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
        };
        return usersService.bulkUpdateStatus(statusDto);
      }),

    resetUserPassword: t.procedure
      .input(resetUserPasswordSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.resetUserPassword(
            input as AdminResetPasswordDto,
          );
        } catch (error) {
          console.error(
            `[UserRouter] Failed to reset password for ${input.userId}:`,
            error,
          );
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reset password',
            cause: error,
          });
        }
      }),

    // New admin functions
    adminChangePassword: t.procedure
      .input(adminChangePasswordSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.adminChangePassword(
            input.userId,
            input.newPassword,
          );
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to change password',
            cause: error,
          });
        }
      }),

    sendMessageToUser: t.procedure
      .input(sendMessageToUserSchema)
      .mutation(async ({ input }) => {
        return usersService.sendMessageToUser(input.userId, input.message);
      }),

    anonymizeUser: t.procedure
      .input(anonymizeUserSchema)
      .mutation(async ({ input }) => {
        return usersService.anonymizeUser(input.userId);
      }),

    createImpersonationToken: t.procedure
      .input(createImpersonationTokenSchema)
      .mutation(async ({ input }) => {
        return usersService.createImpersonationToken(
          input.adminId,
          input.targetUserId,
        );
      }),
  });

// For backward compatibility, export the original router
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const userRouter = createUserRouter(null as any, null as any);
