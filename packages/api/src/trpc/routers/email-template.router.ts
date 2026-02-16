/// ALI-121: tRPC Router for Email Templates & Automation

import { z } from 'zod';
import { t } from '../trpc';
import { EmailTemplateService } from '../../email-templates/email-template.service';
import { TRPCError } from '@trpc/server';
import { TemplateTrigger, RequestStatus } from '@prisma/client';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  templateTriggerSchema,
  requestStatusSchema,
  resetToDefaultSchema,
  updateLocalizationSchema,
  getVariablesByCategorySchema,
} from '@alkitu/shared';
import type { PlaceholderData } from '@alkitu/shared';

/** Extract error message safely from unknown error */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

/**
 * Create email template router with all CRUD operations and utilities
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
    getAll: t.procedure
      .input(
        z.object({
          trigger: templateTriggerSchema.optional(),
          status: requestStatusSchema.optional(),
          active: z.boolean().optional(),
          search: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.findAll({
            trigger: input.trigger as TemplateTrigger | undefined,
            status: input.status as RequestStatus | undefined,
            active: input.active,
            search: input.search,
          });
        } catch (error: unknown) {
          console.error('Error fetching email templates:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch email templates',
          });
        }
      }),

    /**
     * Get a single email template by ID
     */
    getById: t.procedure
      .input(z.object({ id: z.string() }))
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
          console.error('Error fetching email template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch email template',
          });
        }
      }),

    /**
     * Get templates by trigger (and optional status)
     */
    getByTrigger: t.procedure
      .input(
        z.object({
          trigger: templateTriggerSchema,
          status: requestStatusSchema.optional(),
        }),
      )
      .query(async ({ input }) => {
        try {
          return await emailTemplateService.findByTrigger(
            input.trigger as TemplateTrigger,
            input.status as RequestStatus | undefined,
          );
        } catch (error) {
          console.error('Error fetching templates by trigger:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch templates by trigger',
          });
        }
      }),

    /**
     * Get available placeholders
     */
    getAvailablePlaceholders: t.procedure.query(() => {
      try {
        return emailTemplateService.getAvailablePlaceholders();
      } catch (error) {
        console.error('Error fetching available placeholders:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch available placeholders',
        });
      }
    }),

    /**
     * Create a new email template
     */
    create: t.procedure
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
          console.error('Error creating email template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create email template',
          });
        }
      }),

    /**
     * Update an email template
     */
    update: t.procedure
      .input(
        z.object({
          id: z.string(),
          data: updateEmailTemplateSchema,
        }),
      )
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
          console.error('Error updating email template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update email template',
          });
        }
      }),

    /**
     * Delete an email template
     */
    delete: t.procedure
      .input(z.object({ id: z.string() }))
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
          console.error('Error deleting email template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete email template',
          });
        }
      }),

    /**
     * Preview a template with sample data
     */
    previewTemplate: t.procedure
      .input(
        z.object({
          templateId: z.string(),
          data: z.object({
            request: z.object({
              id: z.string(),
              status: z.string(),
              executionDateTime: z.union([z.string(), z.date()]),
              createdAt: z.union([z.string(), z.date()]),
              completedAt: z
                .union([z.string(), z.date()])
                .nullable()
                .optional(),
            }),
            user: z.object({
              firstname: z.string(),
              lastname: z.string(),
              email: z.string().email(),
              phone: z.string().nullable().optional(),
            }),
            service: z.object({
              name: z.string(),
              category: z.string(),
            }),
            location: z.object({
              street: z.string(),
              city: z.string(),
              state: z.string(),
              zipCode: z.string(),
            }),
            employee: z
              .object({
                firstname: z.string(),
                lastname: z.string(),
                email: z.string().email(),
                phone: z.string().nullable().optional(),
              })
              .nullable()
              .optional(),
            templateResponses: z.record(z.unknown()).nullable().optional(),
          }),
        }),
      )
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
          console.error('Error previewing template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to preview template',
          });
        }
      }),

    /**
     * Reset a template to its default content
     */
    resetToDefault: t.procedure
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
          console.error('Error resetting template:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reset template to default',
          });
        }
      }),

    /**
     * Get available variables/placeholders by category
     */
    getVariablesByCategory: t.procedure
      .input(getVariablesByCategorySchema)
      .query(({ input }) => {
        try {
          return emailTemplateService.getVariablesByCategory(input.category);
        } catch (error) {
          console.error('Error fetching variables by category:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch variables by category',
          });
        }
      }),

    /**
     * Update or insert a localized version of a template
     */
    updateLocalization: t.procedure
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
          console.error('Error updating localization:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update localization',
          });
        }
      }),

    /**
     * Get all templates grouped by category
     */
    getGroupedByCategory: t.procedure.query(async () => {
      try {
        return await emailTemplateService.findAllGroupedByCategory();
      } catch (error) {
        console.error('Error fetching grouped templates:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch grouped templates',
        });
      }
    }),

    /**
     * Send all active templates as test emails to a recipient
     */
    sendAllTestEmails: t.procedure
      .input(z.object({ recipient: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          return await emailTemplateService.sendAllTestEmails(input.recipient);
        } catch (error) {
          console.error('Error sending test emails:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to send test emails',
          });
        }
      }),
  });
