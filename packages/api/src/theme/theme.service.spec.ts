import { Test, TestingModule } from '@nestjs/testing';
import { ThemeService, SaveThemeDto, UpdateThemeDto } from './theme.service';
import { PrismaService } from '../prisma.service';
import { Theme } from '@prisma/client';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('ThemeService', () => {
  let service: ThemeService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockAdminId = 'admin-123';
  const mockUserId = 'user-456';
  const mockCompanyId = 'company-123';
  const mockThemeId = 'theme-123';

  const mockTheme: Theme = {
    id: mockThemeId,
    name: 'Test Theme',
    description: 'A test theme',
    version: '1.0.0',
    author: 'Test Author',
    createdById: mockAdminId,
    companyId: mockCompanyId,
    lightModeConfig: { primary: '#fff' },
    darkModeConfig: { primary: '#000' },
    typography: { fontFamily: 'Arial' },
    themeData: null,
    tags: ['test', 'theme'],
    isPublic: false,
    isFavorite: false,
    isActive: false,
    isDefault: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockAdmin = { role: 'ADMIN' };
  const mockNonAdmin = { role: 'EMPLOYEE' };

  beforeEach(async () => {
    const mockPrismaService = {
      theme: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ThemeService>(ThemeService);
    prismaService = module.get<PrismaService>(PrismaService) as jest.Mocked<PrismaService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. SAVE THEME TESTS
  describe('saveTheme', () => {
    const saveDto: SaveThemeDto = {
      name: 'New Theme',
      description: 'New theme description',
      createdById: mockAdminId,
      companyId: mockCompanyId,
      lightModeConfig: { primary: '#fff' },
      darkModeConfig: { primary: '#000' },
    };

    it('should create a theme successfully when user is ADMIN', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.saveTheme(saveDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockAdminId },
        select: { role: true },
      });
      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: saveDto.name,
          description: saveDto.description,
          createdById: mockAdminId,
          isActive: false,
        }),
      });
      expect(result).toEqual(mockTheme);
    });

    it('should always create theme with isActive: false', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      await service.saveTheme({ ...saveDto, isActive: true });

      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isActive: false,
        }),
      });
    });

    it('should throw UnauthorizedException when non-admin tries to create', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);

      await expect(service.saveTheme(saveDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should use default values for optional fields', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      await service.saveTheme({ name: 'Minimal Theme', createdById: mockAdminId });

      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isPublic: false,
          isFavorite: false,
          isActive: false,
          isDefault: false,
          tags: [],
        }),
      });
    });

    it('should support deprecated userId field for backward compatibility', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      await service.saveTheme({ name: 'Theme', userId: mockAdminId });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockAdminId },
        select: { role: true },
      });
    });

    it('should skip authorization check when no createdById/userId provided', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.saveTheme({ name: 'Public Theme' });

      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
      expect(result).toEqual(mockTheme);
    });
  });

  // 2. UPDATE THEME TESTS
  describe('updateTheme', () => {
    const updateDto: UpdateThemeDto = {
      id: mockThemeId,
      name: 'Updated Theme',
      description: 'Updated description',
      createdById: mockAdminId,
    };

    it('should update a theme successfully when user is ADMIN', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        name: 'Updated Theme',
      });

      const result = await service.updateTheme(updateDto);

      expect(result.name).toBe('Updated Theme');
    });

    it('should allow theme creator to update their own theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        name: 'Updated Theme',
      });

      const result = await service.updateTheme({
        id: mockThemeId,
        name: 'Updated Theme',
        createdById: mockAdminId,
      });

      expect(result.name).toBe('Updated Theme');
    });

    it('should throw UnauthorizedException when non-admin/non-creator tries to update', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);

      await expect(
        service.updateTheme({ id: mockThemeId, name: 'Hacked', userId: mockUserId }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when theme does not exist', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateTheme({ id: 'nonexistent', createdById: mockAdminId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should strip isActive from update data', async () => {
      prismaService.theme.update = jest.fn().mockResolvedValue(mockTheme);

      await service.updateTheme({ id: mockThemeId, isActive: true });

      const updateCall = (prismaService.theme.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('isActive');
    });

    it('should exclude id from update data', async () => {
      prismaService.theme.update = jest.fn().mockResolvedValue(mockTheme);

      await service.updateTheme({ id: mockThemeId, name: 'Updated' });

      const updateCall = (prismaService.theme.update as jest.Mock).mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('id');
      expect(updateCall.where.id).toBe(mockThemeId);
    });
  });

  // 3. GET THEME TESTS
  describe('getTheme', () => {
    it('should return a theme by ID', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.getTheme(mockThemeId);

      expect(prismaService.theme.findUnique).toHaveBeenCalledWith({
        where: { id: mockThemeId },
      });
      expect(result).toEqual(mockTheme);
    });

    it('should return null when theme not found', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.getTheme('non-existent-id');

      expect(result).toBeNull();
    });
  });

  // 4. GET THEME BY ID (ALIAS) TESTS
  describe('getThemeById', () => {
    it('should call getTheme internally', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.getThemeById(mockThemeId);

      expect(prismaService.theme.findUnique).toHaveBeenCalledWith({
        where: { id: mockThemeId },
      });
      expect(result).toEqual(mockTheme);
    });
  });

  // 5. CREATE THEME (ALIAS) TESTS
  describe('createTheme', () => {
    it('should call saveTheme internally', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.createTheme({ name: 'Test', createdById: mockAdminId });

      expect(prismaService.theme.create).toHaveBeenCalled();
      expect(result).toEqual(mockTheme);
    });
  });

  // 6. GET GLOBAL ACTIVE THEME TESTS
  describe('getGlobalActiveTheme', () => {
    it('should return the global active theme', async () => {
      const activeTheme = { ...mockTheme, isActive: true };
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(activeTheme);

      const result = await service.getGlobalActiveTheme();

      expect(prismaService.theme.findFirst).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(activeTheme);
    });

    it('should return null when no active theme exists', async () => {
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(null);

      const result = await service.getGlobalActiveTheme();

      expect(result).toBeNull();
    });
  });

  // 7. SET GLOBAL ACTIVE THEME TESTS
  describe('setGlobalActiveTheme', () => {
    it('should set theme as global active when user is ADMIN', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);

      const activatedTheme = { ...mockTheme, isActive: true };
      prismaService.$transaction = jest.fn().mockResolvedValue(activatedTheme);

      const result = await service.setGlobalActiveTheme(mockThemeId, mockAdminId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockAdminId },
        select: { role: true },
      });
      expect(result).toEqual(activatedTheme);
    });

    it('should throw UnauthorizedException when non-admin tries to activate', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);

      await expect(
        service.setGlobalActiveTheme(mockThemeId, mockUserId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when theme does not exist', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.setGlobalActiveTheme('non-existent', mockAdminId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // 8. LIST ALL THEMES TESTS
  describe('listAllThemes', () => {
    it('should return all themes ordered by updatedAt desc', async () => {
      const themes = [mockTheme, { ...mockTheme, id: 'theme-2', name: 'Theme 2' }];
      prismaService.theme.findMany = jest.fn().mockResolvedValue(themes);

      const result = await service.listAllThemes();

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(themes);
    });

    it('should return empty array when no themes exist', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.listAllThemes();

      expect(result).toEqual([]);
    });
  });

  // 9. DELETE THEME TESTS
  describe('deleteTheme', () => {
    it('should delete a theme successfully', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.delete = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.deleteTheme(mockThemeId);

      expect(prismaService.theme.delete).toHaveBeenCalledWith({
        where: { id: mockThemeId },
      });
      expect(result).toEqual(mockTheme);
    });

    it('should throw NotFoundException when theme does not exist', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.deleteTheme(mockThemeId)).rejects.toThrow(NotFoundException);
    });

    it('should throw error when trying to delete active theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue({
        ...mockTheme,
        isActive: true,
      });

      await expect(service.deleteTheme(mockThemeId)).rejects.toThrow(
        'Cannot delete the active theme',
      );

      expect(prismaService.theme.delete).not.toHaveBeenCalled();
    });

    it('should allow ADMIN to delete any theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockAdmin);
      prismaService.theme.delete = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.deleteTheme(mockThemeId, mockAdminId);

      expect(result).toEqual(mockTheme);
    });

    it('should allow theme creator to delete their own theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);
      prismaService.theme.delete = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.deleteTheme(mockThemeId, mockAdminId);

      expect(result).toEqual(mockTheme);
    });

    it('should throw UnauthorizedException when non-admin/non-creator tries to delete', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockNonAdmin);

      await expect(service.deleteTheme(mockThemeId, mockUserId)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prismaService.theme.delete).not.toHaveBeenCalled();
    });
  });

  // 10. TOGGLE FAVORITE TESTS
  describe('toggleFavorite', () => {
    it('should toggle favorite from false to true', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isFavorite: true,
      });

      const result = await service.toggleFavorite(mockThemeId);

      expect(prismaService.theme.update).toHaveBeenCalledWith({
        where: { id: mockThemeId },
        data: { isFavorite: true },
      });
      expect(result.isFavorite).toBe(true);
    });

    it('should toggle favorite from true to false', async () => {
      const favoriteTheme = { ...mockTheme, isFavorite: true };
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(favoriteTheme);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isFavorite: false,
      });

      const result = await service.toggleFavorite(mockThemeId);

      expect(prismaService.theme.update).toHaveBeenCalledWith({
        where: { id: mockThemeId },
        data: { isFavorite: false },
      });
      expect(result.isFavorite).toBe(false);
    });

    it('should throw NotFoundException when theme not found', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.toggleFavorite(mockThemeId)).rejects.toThrow(NotFoundException);

      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });

    it('should verify ownership when userId is provided', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isFavorite: true,
      });

      await service.toggleFavorite(mockThemeId, mockAdminId);

      expect(prismaService.theme.update).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user does not own the theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);

      await expect(service.toggleFavorite(mockThemeId, mockUserId)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });
  });

  // 11. EDGE CASES
  describe('Edge Cases', () => {
    it('should handle themes without companyId', async () => {
      const themeWithoutCompany = { ...mockTheme, companyId: null };
      prismaService.theme.create = jest.fn().mockResolvedValue(themeWithoutCompany);

      const result = await service.saveTheme({ name: 'Personal Theme' });

      expect(result).toEqual(themeWithoutCompany);
    });

    it('should handle empty tags array', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue({
        ...mockTheme,
        tags: [],
      });

      const result = await service.saveTheme({ name: 'No Tags Theme', tags: [] });

      expect(result.tags).toEqual([]);
    });

    it('should default tags to empty array when not provided', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue({
        ...mockTheme,
        tags: [],
      });

      await service.saveTheme({ name: 'Theme' });

      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tags: [],
        }),
      });
    });
  });
});
