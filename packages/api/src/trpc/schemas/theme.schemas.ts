import { z } from 'zod';

// Schema for saving a theme
export const saveThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required'),
  description: z.string().optional(),
  author: z.string().optional(),
  userId: z.string().optional(),
  themeData: z.any(), // Complex nested JSON structure
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Schema for updating a theme
export const updateThemeSchema = z.object({
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
export const setActiveThemeSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
});

export const themeSchemas = {
  save: saveThemeSchema,
  update: updateThemeSchema,
  get: getThemeSchema,
  getActive: getActiveThemeSchema,
  list: listThemesSchema,
  delete: deleteThemeSchema,
  toggleFavorite: toggleFavoriteSchema,
  setActive: setActiveThemeSchema,
};
