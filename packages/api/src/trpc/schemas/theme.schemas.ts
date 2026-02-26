import { z } from 'zod';

// Schema for saving a theme
// MODIFIED: Removed isActive, changed userId to createdById
export const saveThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().optional(),
  author: z.string().optional(),
  userId: z.string().optional(), // DEPRECATED: Use createdById
  createdById: z.string().optional(), // User who created the theme (audit only)
  themeData: z.record(z.string(), z.unknown()),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  // isActive removed - use setGlobalActiveTheme instead
});

// Schema for updating a theme
// MODIFIED: Removed isActive
export const updateThemeSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  userId: z.string().optional(), // DEPRECATED: Use createdById
  createdById: z.string().optional(),
  themeData: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  // isActive removed - use setGlobalActiveTheme instead
});

// Schema for getting a theme by ID
export const getThemeSchema = z.object({
  id: z.string(),
});

// Schema for deleting a theme
export const deleteThemeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
});

// Schema for toggling favorite
export const toggleFavoriteSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
});

// Schema for setting global active theme
export const setGlobalActiveThemeSchema = z.object({
  themeId: z.string(),
  requestingUserId: z.string(),
});

// NEW: Schema for listing all themes (no parameters)
export const listAllThemesSchema = z.object({});

// Schema for creating a theme (new format with light/dark mode configs)
export const createThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().optional(),
  author: z.string().optional(),
  companyId: z.string().optional(),
  createdById: z.string(),
  lightModeConfig: z.record(z.string(), z.unknown()),
  darkModeConfig: z.record(z.string(), z.unknown()).optional(),
  typography: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
  isDefault: z.boolean().optional(),
});

// Schema for updating a theme (new format)
export const updateThemeNewSchema = z.object({
  themeId: z.string(),
  userId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  lightModeConfig: z.record(z.string(), z.unknown()).optional(),
  darkModeConfig: z.record(z.string(), z.unknown()).optional(),
  typography: z.record(z.string(), z.unknown()).optional(),
  tags: z.array(z.string()).optional(),
});

// Schema for getting a theme by themeId
export const getThemeByIdSchema = z.object({
  themeId: z.string(),
});

export const themeSchemas = {
  save: saveThemeSchema,
  update: updateThemeSchema,
  get: getThemeSchema,
  delete: deleteThemeSchema,
  toggleFavorite: toggleFavoriteSchema,
  setGlobalActiveTheme: setGlobalActiveThemeSchema,
  listAllThemes: listAllThemesSchema,
  createTheme: createThemeSchema,
  updateTheme: updateThemeNewSchema,
  getThemeById: getThemeByIdSchema,
};
