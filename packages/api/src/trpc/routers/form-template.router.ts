import { z } from 'zod';
import { t, protectedProcedure } from '../trpc';
import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { adminProcedure } from '../middlewares/roles.middleware';

const prisma = new PrismaClient();

/**
 * FormTemplate tRPC Router
 * Handles CRUD operations for reusable form templates
 *
 * Security:
 * - All endpoints require authentication
 * - Create/Update/Delete require admin role
 * - Read operations available to all authenticated users
 *
 * Features:
 * - Create, update, delete (soft delete) form templates
 * - Get by ID, list with pagination/filtering
 * - Link/unlink templates to services
 * - Version history tracking
 * - Usage statistics (how many services use each template)
 */
export function createFormTemplateRouter() {
  return t.router({
    /**
     * Create a new form template
     * Security: Requires admin role
     */
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1, 'Name is required'),
          description: z.string().optional(),
          category: z.string().optional(),
          formSettings: z.any(), // FormSettings JSON
          isActive: z.boolean().default(true),
          isPublic: z.boolean().default(false),
          serviceIds: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { serviceIds, ...templateData } = input;

        const template = await prisma.formTemplate.create({
          data: {
            name: templateData.name,
            description: templateData.description,
            category: templateData.category,
            formSettings: templateData.formSettings as Prisma.InputJsonValue,
            isActive: templateData.isActive ?? true,
            isPublic: templateData.isPublic ?? false,
            serviceIds: serviceIds || [],
            version: '1.0.0',
            createdBy: ctx.user.id,
          },
          include: {
            services: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return template;
      }),

    /**
     * Update an existing form template
     * Security: Requires admin role
     */
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          category: z.string().optional(),
          formSettings: z.any().optional(),
          isActive: z.boolean().optional(),
          isPublic: z.boolean().optional(),
          serviceIds: z.array(z.string()).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { id, serviceIds, ...updateData } = input;

        // Check if template exists
        const existing = await prisma.formTemplate.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        // Update template
        const updated = await prisma.formTemplate.update({
          where: { id },
          data: {
            ...updateData,
            ...(serviceIds !== undefined && { serviceIds }),
            updatedBy: ctx.user.id,
          },
          include: {
            services: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return updated;
      }),

    /**
     * Soft delete a form template
     * Security: Requires admin role
     */
    delete: adminProcedure
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { id } = input;

        // Check if template exists
        const existing = await prisma.formTemplate.findUnique({
          where: { id },
          include: {
            _count: {
              select: { services: true },
            },
          },
        });

        if (!existing) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        // Prevent deletion if template is in use
        if (existing._count.services > 0) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: `Cannot delete template: it is used by ${existing._count.services} service(s). Please unlink it first.`,
          });
        }

        // Soft delete
        const deleted = await prisma.formTemplate.update({
          where: { id },
          data: {
            deletedAt: new Date(),
            isActive: false,
            updatedBy: ctx.user.id,
          },
        });

        return deleted;
      }),

    /**
     * Get a single form template by ID
     * Security: Requires authentication
     */
    getById: protectedProcedure
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const { id } = input;

        const template = await prisma.formTemplate.findUnique({
          where: { id, deletedAt: null },
          include: {
            services: {
              select: {
                id: true,
                name: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            parent: {
              select: {
                id: true,
                name: true,
                version: true,
              },
            },
            versions: {
              select: {
                id: true,
                name: true,
                version: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });

        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        return template;
      }),

    /**
     * Get all form templates with pagination and filtering
     * Security: Requires authentication
     */
    getAll: protectedProcedure
      .input(
        z
          .object({
            page: z.number().min(1).default(1),
            pageSize: z.number().min(1).max(100).default(20),
            search: z.string().optional(),
            category: z.string().optional(),
            isActive: z.boolean().optional(),
            isPublic: z.boolean().optional(),
            sortBy: z
              .enum(['name', 'createdAt', 'updatedAt'])
              .default('createdAt'),
            sortOrder: z.enum(['asc', 'desc']).default('desc'),
          })
          .optional(),
      )
      .query(async ({ input = {} }) => {
        const {
          page = 1,
          pageSize = 20,
          search,
          category,
          isActive,
          isPublic,
          sortBy = 'createdAt',
          sortOrder = 'desc',
        } = input;

        const skip = (page - 1) * pageSize;

        // Build where clause
        const where: Record<string, unknown> = {
          deletedAt: null,
        };

        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ];
        }

        if (category) {
          where.category = category;
        }

        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        if (isPublic !== undefined) {
          where.isPublic = isPublic;
        }

        // Get total count
        const total = await prisma.formTemplate.count({ where });

        // Get templates
        const templates = await prisma.formTemplate.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            _count: {
              select: { services: true },
            },
          },
        });

        // Calculate field count for each template
        const templatesWithStats = templates.map((template) => {
          const settings = template.formSettings as Record<
            string,
            unknown
          > | null;
          const fields = settings?.fields;
          return {
            ...template,
            serviceCount: template._count.services,
            fieldCount: Array.isArray(fields) ? fields.length : 0,
          };
        });

        return {
          data: templatesWithStats,
          pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
          },
        };
      }),

    /**
     * Link a form template to a service
     * Security: Requires admin role
     */
    linkToService: adminProcedure
      .input(
        z.object({
          templateId: z.string(),
          serviceId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const { templateId, serviceId } = input;

        // Verify template exists
        const template = await prisma.formTemplate.findUnique({
          where: { id: templateId, deletedAt: null },
        });

        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        // Verify service exists
        const service = await prisma.service.findUnique({
          where: { id: serviceId, deletedAt: null },
        });

        if (!service) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Service not found',
          });
        }

        // Add service to template's serviceIds (if not already linked)
        const updatedTemplate = await prisma.formTemplate.update({
          where: { id: templateId },
          data: {
            serviceIds: {
              push: template.serviceIds.includes(serviceId) ? [] : serviceId,
            },
          },
        });

        // Add template to service's formTemplateIds (if not already linked)
        await prisma.service.update({
          where: { id: serviceId },
          data: {
            formTemplateIds: {
              push: service.formTemplateIds.includes(templateId)
                ? []
                : templateId,
            },
          },
        });

        return { success: true, template: updatedTemplate };
      }),

    /**
     * Unlink a form template from a service
     * Security: Requires admin role
     */
    unlinkFromService: adminProcedure
      .input(
        z.object({
          templateId: z.string(),
          serviceId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const { templateId, serviceId } = input;

        // Remove service from template's serviceIds
        const template = await prisma.formTemplate.findUnique({
          where: { id: templateId },
        });

        if (template) {
          await prisma.formTemplate.update({
            where: { id: templateId },
            data: {
              serviceIds: template.serviceIds.filter((id) => id !== serviceId),
            },
          });
        }

        // Remove template from service's formTemplateIds
        const service = await prisma.service.findUnique({
          where: { id: serviceId },
        });

        if (service) {
          await prisma.service.update({
            where: { id: serviceId },
            data: {
              formTemplateIds: service.formTemplateIds.filter(
                (id) => id !== templateId,
              ),
            },
          });
        }

        return { success: true };
      }),

    /**
     * Create a new version of an existing template
     * Security: Requires admin role
     */
    createVersion: adminProcedure
      .input(
        z.object({
          id: z.string(),
          changes: z.string().optional(), // Summary of changes
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const { id } = input;

        // Get original template
        const original = await prisma.formTemplate.findUnique({
          where: { id, deletedAt: null },
        });

        if (!original) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        // Parse current version and increment
        const versionParts = original.version.split('.');
        const newVersion = `${versionParts[0]}.${parseInt(versionParts[1]) + 1}.0`;

        // Create new version
        const newTemplate = await prisma.formTemplate.create({
          data: {
            name: original.name,
            description: original.description,
            category: original.category,
            formSettings: original.formSettings,
            version: newVersion,
            isActive: true,
            isPublic: original.isPublic,
            serviceIds: original.serviceIds,
            parentId: original.id,
            createdBy: ctx.user.id,
          },
        });

        return { success: true, newVersion: newTemplate };
      }),

    /**
     * Get version history of a template
     * Security: Requires authentication
     */
    getVersionHistory: protectedProcedure
      .input(
        z.object({
          id: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const { id } = input;

        // Get the template
        const template = await prisma.formTemplate.findUnique({
          where: { id, deletedAt: null },
        });

        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Form template not found',
          });
        }

        // Get all versions (including this one and its children)
        const versions = await prisma.formTemplate.findMany({
          where: {
            OR: [
              { id: template.id },
              { parentId: template.id },
              { parentId: template.parentId || 'never-match' },
            ],
            deletedAt: null,
          },
          select: {
            id: true,
            version: true,
            createdAt: true,
            createdBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        return versions;
      }),

    /**
     * Get all categories used in form templates (for filtering)
     * Security: Requires authentication
     */
    getCategories: protectedProcedure.query(async () => {
      const templates = await prisma.formTemplate.findMany({
        where: {
          deletedAt: null,
          category: { not: null },
        },
        select: {
          category: true,
        },
        distinct: ['category'],
      });

      return templates.map((t) => t.category).filter(Boolean);
    }),
  });
}
