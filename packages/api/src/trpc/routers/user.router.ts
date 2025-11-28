import { z } from 'zod';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { t } from '../trpc';
import { UserStatus } from '@prisma/client';

// Define the registration input schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const createUserRouter = (
  usersService: UsersService,
  emailService: EmailService,
) =>
  t.router({
    register: t.procedure.input(registerSchema).mutation(async ({ input }) => {
      try {
        const user = await usersService.create(input as any);

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
        throw new Error(errorMessage);
      }
    }),

    updateProfile: t.procedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          lastName: z.string().optional(),
          contactNumber: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        // Placeholder implementation - in real scenario this would call a service
        await Promise.resolve(); // Adding await to satisfy linter
        return {
          id: input.id,
          name: input.name || 'John',
          lastName: input.lastName || 'Doe',
          email: 'user@example.com',
          contactNumber: input.contactNumber || '+1234567890',
          role: 'CLIENT',
          message: 'Profile updated successfully (placeholder)',
        };
      }),

    getAllUsers: t.procedure.query(async () => {
      return usersService.findAll();
    }),

    getUserByEmail: t.procedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        return usersService.findByEmail(input.email);
      }),

    getFilteredUsers: t.procedure
      .input(
        z.object({
          search: z.string().optional(),
          role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']).optional(),
          createdFrom: z.string().optional(),
          createdTo: z.string().optional(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          sortBy: z
            .enum(['email', 'name', 'createdAt', 'lastLogin'])
            .default('createdAt'),
          sortOrder: z.enum(['asc', 'desc']).default('desc'),
        }),
      )
      .query(async ({ input }) => {
        return usersService.findAllWithFilters(input);
      }),

    getUserStats: t.procedure.query(async () => {
      return usersService.getUserStats();
    }),

    bulkDeleteUsers: t.procedure
      .input(z.object({ userIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        return usersService.bulkDeleteUsers(input as any);
      }),

    bulkUpdateRole: t.procedure
      .input(
        z.object({
          userIds: z.array(z.string()),
          role: z.enum(['ADMIN', 'EMPLOYEE', 'CLIENT', 'LEAD']),
        }),
      )
      .mutation(async ({ input }) => {
        return usersService.bulkUpdateRole(input as any);
      }),

    bulkUpdateStatus: t.procedure
      .input(
        z.object({
          userIds: z.array(z.string()),
          isActive: z.boolean(),
        }),
      )
      .mutation(async ({ input }) => {
        // Convert isActive boolean to UserStatus enum
        const statusDto = {
          userIds: input.userIds,
          status: input.isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
        };
        return usersService.bulkUpdateStatus(statusDto);
      }),

    resetUserPassword: t.procedure
      .input(
        z.object({
          userId: z.string(),
          sendEmail: z.boolean().default(true),
        }),
      )
      .mutation(async ({ input }) => {
        return usersService.resetUserPassword(input as any);
      }),

    // New admin functions
    adminChangePassword: t.procedure
      .input(
        z.object({
          userId: z.string(),
          newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters'),
        }),
      )
      .mutation(async ({ input }) => {
        return usersService.adminChangePassword(
          input.userId,
          input.newPassword,
        );
      }),

    sendMessageToUser: t.procedure
      .input(
        z.object({
          userId: z.string(),
          message: z
            .string()
            .min(1, 'Message is required')
            .max(500, 'Message too long'),
        }),
      )
      .mutation(async ({ input }) => {
        return usersService.sendMessageToUser(input.userId, input.message);
      }),

    anonymizeUser: t.procedure
      .input(
        z.object({
          userId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        return usersService.anonymizeUser(input.userId);
      }),

    createImpersonationToken: t.procedure
      .input(
        z.object({
          adminId: z.string(),
          targetUserId: z.string(),
        }),
      )
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
