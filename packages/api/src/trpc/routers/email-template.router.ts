/// ALI-121: tRPC Router for Email Templates & Automation

import { t } from '../trpc';
import { adminProcedure } from '../middlewares/roles.middleware';
import { EmailTemplateService } from '../../email-templates/email-template.service';
import { TRPCError } from '@trpc/server';
import { TemplateTrigger, RequestStatus } from '@prisma/client';
import {
  createEmailTemplateSchema,
  resetToDefaultSchema,
  updateLocalizationSchema,
  getVariablesByCategorySchema,
} from '@alkitu/shared';
import type { PlaceholderData } from '@alkitu/shared';
import {
  getAllEmailTemplatesSchema,
  getEmailTemplateByIdSchema,
  getByTriggerSchema,
  updateEmailTemplateInputSchema,
  deleteEmailTemplateSchema,
  previewTemplateSchema,
  sendAllTestEmailsSchema,
} from '../schemas/email-template.schemas';

/** Extract error message safely from unknown error */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

/**
 * Create email template router with all CRUD operations and utilities
 * All endpoints require admin role — email templates are managed only by admins.
 * Internal email sending (notifications) bypasses tRPC entirely.
 *
 * @param emailTemplateService - EmailTemplateService instance
 * @returns tRPC router for email templates
 */
export const createEmailTemplateRouter = (
  emailTemplateService: EmailTemplateService,
) =>
  t.router({
    /**
     * Get all email templates with optional filters
     */
    getAll: adminProcedure
      .input(getAllEmailTemplatesSchema)
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.findAll({
            trigger: input.trigger as TemplateTrigger | undefined,
            status: input.status as RequestStatus | undefined,
            active: input.active,
            search: input.search,
          });
        } catch (error: unknown) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch email templates',
          });
        }
      }),

    /**
     * Get a single email template by ID
     */
    getById: adminProcedure
      .input(getEmailTemplateByIdSchema)
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.findOne(input.id);
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : '';
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch email template',
          });
        }
      }),

    /**
     * Get templates by trigger (and optional status)
     */
    getByTrigger: adminProcedure
      .input(getByTriggerSchema)
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.findByTrigger(
            input.trigger as TemplateTrigger,
            input.status as RequestStatus | undefined,
          );
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch templates by trigger',
          });
        }
      }),

    /**
     * Get available placeholders
     */
    getAvailablePlaceholders: adminProcedure.query(() => {
      try {
        return emailTemplateService.getAvailablePlaceholders();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch available placeholders',
        });
      }
    }),

    /**
     * Create a new email template
     */
    create: adminProcedure
      .input(createEmailTemplateSchema)
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.create(input);
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('already exists')) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email template with this name already exists',
            });
          }
          if (msg.includes('required') || msg.includes('must be null')) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: msg,
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create email template',
          });
        }
      }),

    /**
     * Update an email template
     */
    update: adminProcedure
      .input(updateEmailTemplateInputSchema)
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.update(input.id, input.data);
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          if (msg.includes('already exists')) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email template with this name already exists',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update email template',
          });
        }
      }),

    /**
     * Delete an email template
     */
    delete: adminProcedure
      .input(deleteEmailTemplateSchema)
      .mutation(async ({ input }) => {
        try {
          await emailTemplateService.delete(input.id);
          return { success: true };
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete email template',
          });
        }
      }),

    /**
     * Preview a template with sample data
     */
    previewTemplate: adminProcedure
      .input(previewTemplateSchema)
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.previewTemplate(
            input.templateId,
            input.data as PlaceholderData,
          );
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to preview template',
          });
        }
      }),

    /**
     * Reset a template to its default content
     */
    resetToDefault: adminProcedure
      .input(resetToDefaultSchema)
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.resetToDefault(input.id);
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          if (msg.includes('does not have default')) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: msg,
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reset template to default',
          });
        }
      }),

    /**
     * Get available variables/placeholders by category
     */
    getVariablesByCategory: adminProcedure
      .input(getVariablesByCategorySchema)
      .query(({ input }) => {
        try {
          return emailTemplateService.getVariablesByCategory(input.category);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch variables by category',
          });
        }
      }),

    /**
     * Update or insert a localized version of a template
     */
    updateLocalization: adminProcedure
      .input(updateLocalizationSchema)
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.updateLocalization(
            input.id,
            input.locale,
            input.subject,
            input.body,
          );
        } catch (error: unknown) {
          const msg = getErrorMessage(error);
          if (msg.includes('not found')) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Email template not found',
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update localization',
          });
        }
      }),

    /**
     * Get all templates grouped by category
     */
    getGroupedByCategory: adminProcedure.query(async () => {
      try {
        return await emailTemplateService.findAllGroupedByCategory();
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch grouped templates',
        });
      }
    }),

    /**
     * Send all active templates as test emails to a recipient
     */
    sendAllTestEmails: adminProcedure
      .input(sendAllTestEmailsSchema)
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.sendAllTestEmails(input.recipient);
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to send test emails',
          });
        }
      }),
  });
