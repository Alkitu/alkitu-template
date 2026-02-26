import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Theme } from '@prisma/client';

export interface SaveThemeDto {
  name: string;
  description?: string;
  author?: string;
  userId?: string; // DEPRECATED: Use createdById
  createdById?: string; // User who created the theme (audit only)
  companyId?: string;
  lightModeConfig?: any;
  darkModeConfig?: any;
  typography?: any;
  themeData?: any; // Complex JSON structure from theme editor (legacy)
  tags?: string[];
  isPublic?: boolean;
  isFavorite?: boolean;
  isActive?: boolean; // DEPRECATED: Use setGlobalActiveTheme instead
  isDefault?: boolean; // DEPRECATED: No longer used
}

export interface UpdateThemeDto extends Partial<SaveThemeDto> {
  id: string;
}

@Injectable()
export class ThemeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Save a new theme
   * MODIFIED: Changed to use createdById, NEVER activates automatically
   */
  async saveTheme(data: SaveThemeDto): Promise<Theme> {
    // Support both userId (deprecated) and createdById for backward compatibility
    const createdById = data.createdById || data.userId;

    // Verify authorization if createdById is provided
    if (createdById) {
      const user = await this.prisma.user.findUnique({
        where: { id: createdById },
        select: { role: true },
      });

      // Only admins can create themes
      if (user?.role !== 'ADMIN') {
        throw new UnauthorizedException('Unauthorized to create themes. Only admins can create themes.');
      }
    }

    // MODIFIED: Always create theme as inactive (isActive: false)
    // Use setGlobalActiveTheme to activate after creation
    return this.prisma.theme.create({
      data: {
        name: data.name,
        description: data.description,
        author: data.author,
        createdById: createdById,
        companyId: data.companyId,
        lightModeConfig: data.lightModeConfig,
        darkModeConfig: data.darkModeConfig,
        typography: data.typography,
        themeData: data.themeData,
        tags: data.tags || [],
        isPublic: data.isPublic ?? false,
        isFavorite: data.isFavorite ?? false,
        isActive: false, // ALWAYS false - use setGlobalActiveTheme to activate
        isDefault: data.isDefault ?? false, // Kept for backward compatibility
      },
    });
  }

  /**
   * Update an existing theme
   * MODIFIED: Removed ability to change isActive directly (must use setGlobalActiveTheme)
   */
  async updateTheme(data: UpdateThemeDto): Promise<Theme> {
    const { id, isActive, userId, ...updateData } = data;

    // Support both userId and createdById for backward compatibility
    const requestingUserId = userId || updateData.createdById;

    // Verify authorization if requestingUserId is provided
    if (requestingUserId) {
      const theme = await this.prisma.theme.findUnique({
        where: { id },
      });

      if (!theme) {
        throw new NotFoundException('Theme not found');
      }

      // Get user to check role
      const user = await this.prisma.user.findUnique({
        where: { id: requestingUserId },
        select: { role: true },
      });

      // Allow if user is ADMIN or if user is the theme creator
      const isAdmin = user?.role === 'ADMIN';
      const isCreator = theme.createdById === requestingUserId;

      if (!isAdmin && !isCreator) {
        throw new UnauthorizedException('Unauthorized to update this theme. Only admins or the theme creator can update themes.');
      }
    }

    // MODIFIED: isActive is explicitly removed from updateData
    // Use setGlobalActiveTheme to activate a theme
    if (isActive !== undefined) {
      console.warn('Cannot set isActive directly. Use setGlobalActiveTheme instead.');
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
   * Get the GLOBAL active theme (platform-wide)
   * No depende de userId ni companyId
   */
  async getGlobalActiveTheme(): Promise<Theme | null> {
    return this.prisma.theme.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Set a theme as the GLOBAL active theme
   * Solo ADMIN puede ejecutar
   * Automáticamente desactiva cualquier otro tema activo
   */
  async setGlobalActiveTheme(
    themeId: string,
    requestingUserId: string,
  ): Promise<Theme> {
    // 1. Validar ADMIN
    const user = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { role: true },
    });
    if (user?.role !== 'ADMIN') {
      throw new UnauthorizedException('Only administrators can change platform theme');
    }

    // 2. Verificar que tema existe
    const theme = await this.prisma.theme.findUnique({ where: { id: themeId } });
    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    // 3. TRANSACCIÓN: Desactivar todos y activar seleccionado
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.theme.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
      return tx.theme.update({
        where: { id: themeId },
        data: { isActive: true },
      });
    });
  }

  /**
   * List all themes (platform-wide)
   * New method for explicit global theme listing
   */
  async listAllThemes(): Promise<Theme[]> {
    return this.prisma.theme.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Delete a theme
   * MODIFIED: Prevents deleting active theme, validates ADMIN role
   */
  async deleteTheme(id: string, userId?: string): Promise<Theme> {
    const theme = await this.prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      throw new NotFoundException('Theme not found');
    }

    // MODIFIED: Prevent deleting active theme
    if (theme.isActive) {
      throw new Error('Cannot delete the active theme. Please activate another theme first.');
    }

    // Verify authorization if userId is provided
    if (userId) {
      // Get user to check role
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      // Allow if user is ADMIN or if user is the theme creator
      const isAdmin = user?.role === 'ADMIN';
      const isCreator = theme.createdById === userId;

      if (!isAdmin && !isCreator) {
        throw new UnauthorizedException('Unauthorized to delete this theme. Only admins or the theme creator can delete themes.');
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
      throw new NotFoundException('Theme not found');
    }

    // MODIFIED: Use createdById instead of userId
    // Verify ownership if userId is provided
    if (userId && theme.createdById !== userId) {
      throw new UnauthorizedException('Unauthorized to modify this theme');
    }

    return this.prisma.theme.update({
      where: { id },
      data: { isFavorite: !theme.isFavorite },
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

}
