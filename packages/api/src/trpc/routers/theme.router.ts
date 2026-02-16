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
          themeData: input.themeData as Record<string, unknown>,
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
          themeData: input.themeData as Record<string, unknown> | undefined,
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

    // NEW: Get the GLOBAL active theme (platform-wide)
    getGlobalActiveTheme: t.procedure
      .input(z.void().optional())
      .query(async () => {
        return themeService.getGlobalActiveTheme();
      }),

    // @deprecated Use getGlobalActiveTheme instead
    getActive: t.procedure
      .input(z.object({ userId: z.string().optional() }))
      .query(async ({ input }) => {
        console.warn(
          'getActive is deprecated. Use getGlobalActiveTheme instead.',
        );
        return themeService.getActiveTheme(input.userId);
      }),

    // NEW: List all themes (platform-wide, no filters)
    listAllThemes: t.procedure.input(z.void().optional()).query(async () => {
      return themeService.listAllThemes();
    }),

    // @deprecated Use listAllThemes instead
    list: t.procedure
      .input(
        z.object({
          userId: z.string().optional(),
          includePublic: z.boolean().optional().default(true),
        }),
      )
      .query(async ({ input }) => {
        console.warn('list is deprecated. Use listAllThemes instead.');
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

    // NEW: Set global active theme (platform-wide)
    setGlobalActiveTheme: t.procedure
      .input(
        z.object({
          themeId: z.string(),
          requestingUserId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        console.log('🌍 [tRPC] setGlobalActiveTheme mutation called with:', {
          themeId: input.themeId,
          requestingUserId: input.requestingUserId,
        });
        const result = await themeService.setGlobalActiveTheme(
          input.themeId,
          input.requestingUserId,
        );
        console.log('✅ [tRPC] setGlobalActiveTheme mutation successful');
        return result;
      }),

    // @deprecated Use setGlobalActiveTheme instead
    setActive: t.procedure
      .input(
        z.object({
          id: z.string(),
          userId: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        console.warn(
          'setActive is deprecated. Use setGlobalActiveTheme instead.',
        );
        return themeService.setActiveTheme(input.id, input.userId);
      }),

    // @deprecated Use listAllThemes instead
    getCompanyThemes: t.procedure
      .input(
        z.object({
          companyId: z.string(),
          activeOnly: z.boolean().optional().default(false),
        }),
      )
      .query(async ({ input }) => {
        console.warn(
          'getCompanyThemes is deprecated. Use listAllThemes instead.',
        );
        return themeService.getCompanyThemes(input.companyId, input.activeOnly);
      }),

    // Get theme by ID
    getThemeById: t.procedure
      .input(z.object({ themeId: z.string() }))
      .query(async ({ input }) => {
        return themeService.getThemeById(input.themeId);
      }),

    // Create a new theme
    // MODIFIED: Uses createdById, always creates inactive theme
    createTheme: t.procedure
      .input(
        z.object({
          name: z.string().min(1, 'Theme name is required'),
          description: z.string().optional(),
          author: z.string().optional(),
          companyId: z.string().optional(),
          createdById: z.string(),
          lightModeConfig: z.any(),
          darkModeConfig: z.any().optional(),
          typography: z.any().optional(),
          tags: z.array(z.string()).optional(),
          isDefault: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        console.log('📝 [tRPC] createTheme mutation called with:', {
          name: input.name,
          companyId: input.companyId,
          createdById: input.createdById,
        });
        const result = await themeService.createTheme({
          name: input.name,
          description: input.description,
          author: input.author,
          createdById: input.createdById,
          companyId: input.companyId,
          lightModeConfig: input.lightModeConfig as Record<string, unknown>,
          darkModeConfig: input.darkModeConfig as
            | Record<string, unknown>
            | undefined,
          typography: input.typography as Record<string, unknown> | undefined,
          tags: input.tags,
          isDefault: input.isDefault,
        });
        console.log(
          '✅ [tRPC] createTheme mutation successful, theme ID:',
          result.id,
        );
        return result;
      }),

    // Update an existing theme
    // MODIFIED: Removed isActive from input (use setGlobalActiveTheme)
    updateTheme: t.procedure
      .input(
        z.object({
          themeId: z.string(),
          userId: z.string(), // requestingUserId
          name: z.string().optional(),
          description: z.string().optional(),
          lightModeConfig: z.any().optional(),
          darkModeConfig: z.any().optional(),
          typography: z.any().optional(),
          tags: z.array(z.string()).optional(),
          // isActive removed - use setGlobalActiveTheme instead
        }),
      )
      .mutation(async ({ input }) => {
        console.log('🔄 [tRPC] updateTheme mutation called with:', {
          themeId: input.themeId,
          name: input.name,
          userId: input.userId,
        });
        const result = await themeService.updateTheme({
          id: input.themeId,
          name: input.name,
          description: input.description,
          userId: input.userId,
          lightModeConfig: input.lightModeConfig as
            | Record<string, unknown>
            | undefined,
          darkModeConfig: input.darkModeConfig as
            | Record<string, unknown>
            | undefined,
          typography: input.typography as Record<string, unknown> | undefined,
          tags: input.tags,
        });
        console.log(
          '✅ [tRPC] updateTheme mutation successful, theme ID:',
          result.id,
        );
        return result;
      }),

    // @deprecated Use setGlobalActiveTheme instead
    setDefaultTheme: t.procedure
      .input(
        z.object({
          themeId: z.string(),
          companyId: z.string(),
          userId: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        console.warn(
          'setDefaultTheme is deprecated. Use setGlobalActiveTheme instead.',
        );
        console.log('⭐ [tRPC] setDefaultTheme mutation called with:', {
          themeId: input.themeId,
          companyId: input.companyId,
          userId: input.userId,
        });
        const result = await themeService.setDefaultTheme(
          input.themeId,
          input.companyId,
          input.userId,
        );
        console.log('✅ [tRPC] setDefaultTheme mutation successful');
        return result;
      }),
  });
}
