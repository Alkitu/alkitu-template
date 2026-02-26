import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { DriveFolderService } from '../../drive/drive-folder.service';
import { DriveService } from '../../drive/drive.service';
import { t, protectedProcedure } from '../trpc';
import { UserStatus, UserRole } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '../middlewares/roles.middleware';
import { handlePrismaError } from '../utils/prisma-error-mapper';
import { z } from 'zod';
import {
  paginatedSortingSchema,
  createPaginatedResponse,
  calculatePagination,
} from '../schemas/common.schemas';
import {
  registerSchema,
  updateProfileSchema,
  getUserByEmailSchema,
  getFilteredUsersSchema,
  bulkDeleteUsersSchema,
  bulkUpdateRoleSchema,
  bulkUpdateStatusSchema,
  resetUserPasswordSchema,
  adminChangePasswordSchema,
  sendMessageToUserSchema,
  anonymizeUserSchema,
  createImpersonationTokenSchema,
  changeMyPasswordSchema,
  updateMyProfileSchema,
  updateMyPreferencesSchema,
} from '../schemas/user.schemas';
import { FilterUsersDto } from '../../users/dto/filter-users.dto';

/**
 * User Router
 * All schemas are imported from '../schemas/user.schemas.ts'
 */

export const createUserRouter = (
  usersService: UsersService,
  emailService: EmailService,
  driveFolderService: DriveFolderService,
  driveService: DriveService,
) =>
  t.router({
    // Intentionally public: returns null for unauthenticated requests (session check)
    me: t.procedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      try {
        return await usersService.findOne(ctx.user.id);
      } catch {
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
            loginUrl: `${frontendUrl}/auth/login`,
            unsubscribeUrl: `${frontendUrl}/unsubscribe`,
            supportUrl: `${frontendUrl}/support`,
          });
        } catch {
          // Non-blocking: registration succeeds even if welcome email fails
        }

        return {
          success: true,
          message: 'User registered successfully. Welcome email sent!',
          user,
        };
      } catch (error: unknown) {
        handlePrismaError(error, 'register user');
      }
    }),

    updateProfile: protectedProcedure
      .input(updateProfileSchema)
      .mutation(async ({ input, ctx }) => {
        // Security: Users can only update their own profile (except ADMIN)
        if (ctx.user.role !== UserRole.ADMIN && ctx.user.id !== input.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Cannot update profile of another user',
          });
        }

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
          handlePrismaError(error, 'update user profile');
        }
      }),

    getAllUsers: adminProcedure
      .input(paginatedSortingSchema.optional())
      .query(async ({ input }) => {
        try {
          // Use default values if no input provided
          const page = input?.page || 1;
          const limit = input?.limit || 20;
          const sortBy = input?.sortBy || 'createdAt';
          const sortOrder = input?.sortOrder || 'desc';

          const { skip, take } = calculatePagination(page, limit);

          // Get users with pagination
          const [users, total] = await Promise.all([
            usersService['prisma'].user.findMany({
              skip,
              take,
              orderBy: { [sortBy]: sortOrder },
              select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                lastLogin: true,
              },
            }),
            usersService['prisma'].user.count(),
          ]);

          return createPaginatedResponse(users, { page, limit, total });
        } catch (error) {
          handlePrismaError(error, 'fetch all users');
        }
      }),

    getUserByEmail: adminProcedure
      .input(getUserByEmailSchema)
      .query(async ({ input }) => {
        try {
          return await usersService.findByEmail(input.email);
        } catch (error) {
          handlePrismaError(error, 'find user by email');
        }
      }),

    getFilteredUsers: adminProcedure
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
          handlePrismaError(error, 'filter users');
        }
      }),

    getUserStats: protectedProcedure.query(async () => {
      return usersService.getUserStats();
    }),

    bulkDeleteUsers: adminProcedure
      .input(bulkDeleteUsersSchema)
      .mutation(async ({ input }) => {
        return usersService.bulkDeleteUsers(input);
      }),

    bulkUpdateRole: adminProcedure
      .input(bulkUpdateRoleSchema)
      .mutation(async ({ input }) => {
        return usersService.bulkUpdateRole({
          userIds: input.userIds,
          role: input.role,
        });
      }),

    bulkUpdateStatus: adminProcedure
      .input(bulkUpdateStatusSchema)
      .mutation(async ({ input }) => {
        // Convert isActive boolean to UserStatus enum
        return usersService.bulkUpdateStatus({
          userIds: input.userIds,
          status: input.isActive ? UserStatus.VERIFIED : UserStatus.SUSPENDED,
        });
      }),

    resetUserPassword: adminProcedure
      .input(resetUserPasswordSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.resetUserPassword(input);
        } catch (error) {
          handlePrismaError(error, 'reset user password');
        }
      }),

    // New admin functions
    adminChangePassword: adminProcedure
      .input(adminChangePasswordSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.adminChangePassword(
            input.userId,
            input.newPassword,
          );
        } catch (error) {
          handlePrismaError(error, 'change user password');
        }
      }),

    sendMessageToUser: adminProcedure
      .input(sendMessageToUserSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.sendMessageToUser(
            input.userId,
            input.message,
          );
        } catch (error) {
          handlePrismaError(error, 'send message to user');
        }
      }),

    anonymizeUser: adminProcedure
      .input(anonymizeUserSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.anonymizeUser(input.userId);
        } catch (error) {
          handlePrismaError(error, 'anonymize user');
        }
      }),

    createImpersonationToken: adminProcedure
      .input(createImpersonationTokenSchema)
      .mutation(async ({ input }) => {
        try {
          return await usersService.createImpersonationToken(
            input.adminId,
            input.targetUserId,
          );
        } catch (error) {
          handlePrismaError(error, 'create impersonation token');
        }
      }),

    /**
     * Change own password (authenticated user)
     * Validates current password before allowing change
     */
    changeMyPassword: protectedProcedure
      .input(changeMyPasswordSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          return await usersService.changePassword(ctx.user.id, {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          });
        } catch (error) {
          handlePrismaError(error, 'change password');
        }
      }),

    /**
     * Update own profile (authenticated user)
     * Role-based field filtering handled by UsersService.updateProfile()
     */
    updateMyProfile: protectedProcedure
      .input(updateMyProfileSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          const updateDto = {
            firstname: input.firstname,
            lastname: input.lastname,
            phone: input.phone,
            company: input.company,
            address: input.address,
            ...(input.contactPerson && {
              contactPerson: {
                name: input.contactPerson.name,
                lastname: input.contactPerson.lastname,
                phone: input.contactPerson.phone,
                email: input.contactPerson.email,
              },
            }),
          };
          const updatedUser = await usersService.updateProfile(
            ctx.user.id,
            updateDto,
          );
          return {
            ...updatedUser,
            message: 'Profile updated successfully',
          };
        } catch (error) {
          handlePrismaError(error, 'update own profile');
        }
      }),

    /**
     * Update own preferences (theme, language)
     */
    updateMyPreferences: protectedProcedure
      .input(updateMyPreferencesSchema)
      .mutation(async ({ input, ctx }) => {
        try {
          const updated = await usersService['prisma'].user.update({
            where: { id: ctx.user.id },
            data: {
              theme: input.theme,
              language: input.language,
            },
            select: {
              id: true,
              theme: true,
              language: true,
            },
          });
          return {
            ...updated,
            message: 'Preferences updated successfully',
          };
        } catch (error) {
          handlePrismaError(error, 'update preferences');
        }
      }),

    /**
     * Upload user avatar to Google Drive profile folder
     * Security: Users can only upload their own avatar
     */
    uploadAvatar: protectedProcedure
      .input(
        z.object({
          data: z.string(), // base64 encoded image
          mimeType: z.string(),
          fileName: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        // Ensure user Drive folders exist
        const { profileFolderId } = await driveFolderService.ensureUserFolders(
          ctx.user.id,
        );

        // Upload image to profile folder
        const buffer = Buffer.from(input.data, 'base64');
        const driveFile = await driveService.uploadBuffer(
          buffer,
          input.fileName,
          input.mimeType,
          { parentId: profileFolderId },
        );

        // Update user's image field with the web view link
        const imageUrl = driveFile.webViewLink || `drive:${driveFile.id}`;
        await usersService['prisma'].user.update({
          where: { id: ctx.user.id },
          data: { image: imageUrl },
        });

        return { imageUrl, fileId: driveFile.id };
      }),
  });
