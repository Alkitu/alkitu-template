import { z } from 'zod';
import { t } from '../trpc';
import { ThemeService } from '@/theme/theme.service';

// Define the createThemeRouter factory function
export function createThemeRouter(themeService: ThemeService) {
  return t.router({
    // Save a new theme
    save: t.procedure
      .input(
        z.object({
          name: z.string().min(1, 'Theme name is required'),
          description: z.string().optional(),
          author: z.string().optional(),
          userId: z.string().optional(),
          themeData: z.any(), // Complex nested JSON structure
          tags: z.array(z.string()).optional(),
          isPublic: z.boolean().optional(),
          isFavorite: z.boolean().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.saveTheme({
          name: input.name,
          description: input.description,
          author: input.author,
          userId: input.userId,
          themeData: input.themeData,
          tags: input.tags,
          isPublic: input.isPublic,
          isFavorite: input.isFavorite,
          isActive: input.isActive,
        });
      }),

    // Update an existing theme
    update: t.procedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          description: z.string().optional(),
          author: z.string().optional(),
          userId: z.string().optional(),
          themeData: z.any().optional(),
          tags: z.array(z.string()).optional(),
          isPublic: z.boolean().optional(),
          isFavorite: z.boolean().optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.updateTheme({
          id: input.id,
          name: input.name,
          description: input.description,
          author: input.author,
          userId: input.userId,
          themeData: input.themeData,
          tags: input.tags,
          isPublic: input.isPublic,
          isFavorite: input.isFavorite,
          isActive: input.isActive,
        });
      }),

    // Get a theme by ID
    get: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return themeService.getTheme(input.id);
      }),

    // Get the active theme
    getActive: t.procedure
      .input(z.object({ userId: z.string().optional() }))
      .query(async ({ input }) => {
        return themeService.getActiveTheme(input.userId);
      }),

    // List all themes
    list: t.procedure
      .input(
        z.object({
          userId: z.string().optional(),
          includePublic: z.boolean().optional().default(true),
        }),
      )
      .query(async ({ input }) => {
        return themeService.listThemes(input.userId, input.includePublic);
      }),

    // Delete a theme
    delete: t.procedure
      .input(
        z.object({
          id: z.string(),
          userId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.deleteTheme(input.id, input.userId);
      }),

    // Toggle favorite status
    toggleFavorite: t.procedure
      .input(
        z.object({
          id: z.string(),
          userId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.toggleFavorite(input.id, input.userId);
      }),

    // Set active theme
    setActive: t.procedure
      .input(
        z.object({
          id: z.string(),
          userId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.setActiveTheme(input.id, input.userId);
      }),

    // Get themes by company ID
    getCompanyThemes: t.procedure
      .input(
        z.object({
          companyId: z.string(),
          activeOnly: z.boolean().optional().default(false),
        }),
      )
      .query(async ({ input }) => {
        return themeService.getCompanyThemes(input.companyId, input.activeOnly);
      }),

    // Get theme by ID
    getThemeById: t.procedure
      .input(z.object({ themeId: z.string() }))
      .query(async ({ input }) => {
        return themeService.getThemeById(input.themeId);
      }),

    // Create a new theme
    createTheme: t.procedure
      .input(
        z.object({
          name: z.string().min(1, 'Theme name is required'),
          description: z.string().optional(),
          author: z.string().optional(),
          companyId: z.string(),
          createdById: z.string(),
          lightModeConfig: z.any(),
          darkModeConfig: z.any().optional(),
          typography: z.any().optional(),
          tags: z.array(z.string()).optional(),
          isDefault: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.createTheme({
          name: input.name,
          description: input.description,
          author: input.author,
          userId: input.createdById,
          companyId: input.companyId,
          lightModeConfig: input.lightModeConfig,
          darkModeConfig: input.darkModeConfig,
          typography: input.typography,
          tags: input.tags,
          isDefault: input.isDefault,
        });
      }),

    // Update an existing theme
    updateTheme: t.procedure
      .input(
        z.object({
          themeId: z.string(),
          userId: z.string(),
          name: z.string().optional(),
          description: z.string().optional(),
          lightModeConfig: z.any().optional(),
          darkModeConfig: z.any().optional(),
          typography: z.any().optional(),
          tags: z.array(z.string()).optional(),
          isActive: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.updateTheme({
          id: input.themeId,
          name: input.name,
          description: input.description,
          userId: input.userId,
          lightModeConfig: input.lightModeConfig,
          darkModeConfig: input.darkModeConfig,
          typography: input.typography,
          tags: input.tags,
          isActive: input.isActive,
        });
      }),

    // Set default theme for a company
    setDefaultTheme: t.procedure
      .input(
        z.object({
          themeId: z.string(),
          companyId: z.string(),
          userId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        return themeService.setDefaultTheme(input.themeId, input.companyId, input.userId);
      }),
  });
}
