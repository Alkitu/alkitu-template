import { z } from 'zod';

// Schema for saving a theme
// MODIFIED: Removed isActive, changed userId to createdById
export const saveThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().optional(),
  author: z.string().optional(),
  userId: z.string().optional(), // DEPRECATED: Use createdById
  createdById: z.string().optional(), // User who created the theme (audit only)
  themeData: z.any(), // Complex nested JSON structure
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
  themeData: z.any().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  // isActive removed - use setGlobalActiveTheme instead
});

// Schema for getting a theme by ID
export const getThemeSchema = z.object({
  id: z.string(),
});

// Schema for getting active theme
export const getActiveThemeSchema = z.object({
  userId: z.string().optional(),
});

// Schema for listing themes
export const listThemesSchema = z.object({
  userId: z.string().optional(),
  includePublic: z.boolean().optional().default(true),
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

// Schema for setting active theme
// @deprecated Use setGlobalActiveThemeSchema instead
export const setActiveThemeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
});

// NEW: Schema for setting global active theme
export const setGlobalActiveThemeSchema = z.object({
  themeId: z.string(),
  requestingUserId: z.string(),
});

// NEW: Schema for listing all themes (no parameters)
export const listAllThemesSchema = z.object({});

export const themeSchemas = {
  save: saveThemeSchema,
  update: updateThemeSchema,
  get: getThemeSchema,
  getActive: getActiveThemeSchema,
  list: listThemesSchema,
  delete: deleteThemeSchema,
  toggleFavorite: toggleFavoriteSchema,
  setActive: setActiveThemeSchema,
  setGlobalActiveTheme: setGlobalActiveThemeSchema,
  listAllThemes: listAllThemesSchema,
};
