import { t, publicProcedure, protectedProcedure } from '../trpc';
import { adminProcedure } from '../middlewares/roles.middleware';
import { ThemeService } from '../../theme/theme.service';
import { themeSchemas } from '../schemas/theme.schemas';

// Define the createThemeRouter factory function
export function createThemeRouter(themeService: ThemeService) {
  return t.router({
    // Save a new theme (admin only)
    save: adminProcedure
      .input(themeSchemas.save)
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
        });
      }),

    // Update an existing theme (admin only)
    update: adminProcedure
      .input(themeSchemas.update)
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
        });
      }),

    // Get a theme by ID (public — needed to render UI)
    get: publicProcedure
      .input(themeSchemas.get)
      .query(async ({ input }) => {
        return themeService.getTheme(input.id);
      }),

    // Get the GLOBAL active theme (public — needed to render UI before auth)
    getGlobalActiveTheme: publicProcedure.query(async () => {
      return themeService.getGlobalActiveTheme();
    }),

    // List all themes (requires login)
    listAllThemes: protectedProcedure.query(async () => {
      return themeService.listAllThemes();
    }),

    // Delete a theme (admin only)
    delete: adminProcedure
      .input(themeSchemas.delete)
      .mutation(async ({ input }) => {
        return themeService.deleteTheme(input.id, input.userId);
      }),

    // Toggle favorite status (requires login)
    toggleFavorite: protectedProcedure
      .input(themeSchemas.toggleFavorite)
      .mutation(async ({ input }) => {
        return themeService.toggleFavorite(input.id, input.userId);
      }),

    // Set global active theme (admin only)
    setGlobalActiveTheme: adminProcedure
      .input(themeSchemas.setGlobalActiveTheme)
      .mutation(async ({ input }) => {
        return themeService.setGlobalActiveTheme(
          input.themeId,
          input.requestingUserId,
        );
      }),

    // Get theme by ID (public — needed to render UI)
    getThemeById: publicProcedure
      .input(themeSchemas.getThemeById)
      .query(async ({ input }) => {
        return themeService.getThemeById(input.themeId);
      }),

    // Create a new theme (admin only)
    createTheme: adminProcedure
      .input(themeSchemas.createTheme)
      .mutation(async ({ input }) => {
        return themeService.createTheme({
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
      }),

    // Update an existing theme (admin only)
    updateTheme: adminProcedure
      .input(themeSchemas.updateTheme)
      .mutation(async ({ input }) => {
        return themeService.updateTheme({
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
      }),

  });
}
