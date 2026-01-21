import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { Theme } from '@prisma/client';

export interface SaveThemeDto {
  name: string;
  description?: string;
  author?: string;
  userId?: string;
  companyId?: string;
  lightModeConfig?: any;
  darkModeConfig?: any;
  typography?: any;
  themeData?: any; // Complex JSON structure from theme editor (legacy)
  tags?: string[];
  isPublic?: boolean;
  isFavorite?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateThemeDto extends Partial<SaveThemeDto> {
  id: string;
}

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Save a new theme
   */
  async saveTheme(data: SaveThemeDto): Promise<Theme> {
    // Verify authorization if userId is provided
    if (data.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: data.userId },
        select: { role: true },
      });

      // Only admins can create themes
      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized to create themes. Only admins can create themes.');
      }
    }

    // If isActive is true, deactivate all other themes for this user
    if (data.isActive && data.userId) {
      await this.prisma.theme.updateMany({
        where: { userId: data.userId, isActive: true },
        data: { isActive: false },
      });
    }

    // If isDefault is true, remove default from all other themes for this company
    if (data.isDefault && data.companyId) {
      await this.prisma.theme.updateMany({
        where: { companyId: data.companyId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.theme.create({
      data: {
        name: data.name,
        description: data.description,
        author: data.author,
        userId: data.userId,
        companyId: data.companyId,
        lightModeConfig: data.lightModeConfig,
        darkModeConfig: data.darkModeConfig,
        typography: data.typography,
        themeData: data.themeData,
        tags: data.tags || [],
        isPublic: data.isPublic ?? false,
        isFavorite: data.isFavorite ?? false,
        isActive: data.isActive ?? false,
        isDefault: data.isDefault ?? false,
      },
    });
  }

  /**
   * Update an existing theme
   */
  async updateTheme(data: UpdateThemeDto): Promise<Theme> {
    const { id, ...updateData } = data;

    // Verify authorization if userId is provided
    if (updateData.userId) {
      const theme = await this.prisma.theme.findUnique({
        where: { id },
      });

      if (!theme) {
        throw new Error('Theme not found');
      }

      // Get user to check role
      const user = await this.prisma.user.findUnique({
        where: { id: updateData.userId },
        select: { role: true },
      });

      // Allow if user is ADMIN or if user is the theme creator
      const isAdmin = user?.role === 'ADMIN';
      const isCreator = theme.userId === updateData.userId;

      if (!isAdmin && !isCreator) {
        throw new Error('Unauthorized to update this theme. Only admins or the theme creator can update themes.');
      }
    }

    // If isActive is true, deactivate all other themes for this user
    if (updateData.isActive && updateData.userId) {
      await this.prisma.theme.updateMany({
        where: { userId: updateData.userId, isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    return this.prisma.theme.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Get a theme by ID
   */
  async getTheme(id: string): Promise<Theme | null> {
    return this.prisma.theme.findUnique({
      where: { id },
    });
  }

  /**
   * Get the active theme for a user
   */
  async getActiveTheme(userId?: string): Promise<Theme | null> {
    if (!userId) {
      // Return public active theme if no user
      return this.prisma.theme.findFirst({
        where: { isPublic: true, isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return this.prisma.theme.findFirst({
      where: { userId, isActive: true },
    });
  }

  /**
   * List all themes for a user
   */
  async listThemes(userId?: string, includePublic = true): Promise<Theme[]> {
    const where: any = {};

    if (userId) {
      where.OR = [{ userId }, ...(includePublic ? [{ isPublic: true }] : [])];
    } else if (includePublic) {
      where.isPublic = true;
    }

    return this.prisma.theme.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Delete a theme
   */
  async deleteTheme(id: string, userId?: string): Promise<Theme> {
    // Verify authorization if userId is provided
    if (userId) {
      const theme = await this.prisma.theme.findUnique({
        where: { id },
      });

      if (!theme) {
        throw new Error('Theme not found');
      }

      // Get user to check role
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      // Allow if user is ADMIN or if user is the theme creator
      const isAdmin = user?.role === 'ADMIN';
      const isCreator = theme.userId === userId;

      if (!isAdmin && !isCreator) {
        throw new Error('Unauthorized to delete this theme. Only admins or the theme creator can delete themes.');
      }
    }

    return this.prisma.theme.delete({
      where: { id },
    });
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string, userId?: string): Promise<Theme> {
    const theme = await this.prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    // Verify ownership if userId is provided
    if (userId && theme.userId !== userId) {
      throw new Error('Unauthorized to modify this theme');
    }

    return this.prisma.theme.update({
      where: { id },
      data: { isFavorite: !theme.isFavorite },
    });
  }

  /**
   * Set active theme
   */
  async setActiveTheme(id: string, userId?: string): Promise<Theme> {
    const theme = await this.prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    // Verify ownership if userId is provided
    if (userId && theme.userId !== userId) {
      throw new Error('Unauthorized to activate this theme');
    }

    // Deactivate all other themes for this user
    if (theme.userId) {
      await this.prisma.theme.updateMany({
        where: { userId: theme.userId, isActive: true, id: { not: id } },
        data: { isActive: false },
      });
    }

    return this.prisma.theme.update({
      where: { id },
      data: { isActive: true },
    });
  }

  /**
   * Get themes by company ID
   */
  async getCompanyThemes(
    companyId: string,
    activeOnly = false,
  ): Promise<Theme[]> {
    const where: any = { companyId };

    if (activeOnly) {
      where.isActive = true;
    }

    return this.prisma.theme.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Get theme by ID (alias for getTheme)
   */
  async getThemeById(themeId: string): Promise<Theme | null> {
    return this.getTheme(themeId);
  }

  /**
   * Create a new theme (alias for saveTheme)
   */
  async createTheme(data: SaveThemeDto): Promise<Theme> {
    return this.saveTheme(data);
  }

  /**
   * Set a theme as the default theme for a company
   */
  async setDefaultTheme(
    themeId: string,
    companyId: string,
    userId?: string,
  ): Promise<Theme> {
    // Verify authorization if userId is provided
    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      // Only admins can set default themes
      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized to set default theme. Only admins can set default themes.');
      }
    }

    const theme = await this.prisma.theme.findUnique({
      where: { id: themeId },
    });

    if (!theme) {
      throw new Error('Theme not found');
    }

    // Verify the theme belongs to the company
    if (theme.companyId !== companyId) {
      throw new Error('Theme does not belong to this company');
    }

    // Remove default flag from all other themes in this company
    await this.prisma.theme.updateMany({
      where: { companyId, isDefault: true, id: { not: themeId } },
      data: { isDefault: false },
    });

    // Set this theme as default
    return this.prisma.theme.update({
      where: { id: themeId },
      data: { isDefault: true, isActive: true },
    });
  }
}
