import { Test, TestingModule } from '@nestjs/testing';
import { ThemeService, SaveThemeDto, UpdateThemeDto } from './theme.service';
import { PrismaService } from '../prisma.service';
import { Theme } from '@prisma/client';

describe('ThemeService', () => {
  let service: ThemeService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUserId = 'user-123';
  const mockUser2Id = 'user-456';
  const mockCompanyId = 'company-123';
  const mockThemeId = 'theme-123';

  const mockTheme: Theme = {
    id: mockThemeId,
    name: 'Test Theme',
    description: 'A test theme',
    version: '1.0.0',
    author: 'Test Author',
    userId: mockUserId,
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

  beforeEach(async () => {
    // Create mock Prisma service
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
      userId: mockUserId,
      companyId: mockCompanyId,
      lightModeConfig: { primary: '#fff' },
      darkModeConfig: { primary: '#000' },
      isActive: false,
    };

    it('should create a theme successfully', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.saveTheme(saveDto);

      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: saveDto.name,
          description: saveDto.description,
          userId: saveDto.userId,
          companyId: saveDto.companyId,
        }),
      });
      expect(result).toEqual(mockTheme);
    });

    it('should deactivate other active themes when isActive is true', async () => {
      const activeSaveDto = { ...saveDto, isActive: true };
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 2 });
      prismaService.theme.create = jest.fn().mockResolvedValue({ ...mockTheme, isActive: true });

      await service.saveTheme(activeSaveDto);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        data: { isActive: false },
      });
      expect(prismaService.theme.create).toHaveBeenCalled();
    });

    it('should remove default from other company themes when isDefault is true', async () => {
      const defaultSaveDto = { ...saveDto, isDefault: true };
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.create = jest.fn().mockResolvedValue({ ...mockTheme, isDefault: true });

      await service.saveTheme(defaultSaveDto);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId, isDefault: true },
        data: { isDefault: false },
      });
    });

    it('should handle both isActive and isDefault simultaneously', async () => {
      const bothActiveDto = { ...saveDto, isActive: true, isDefault: true };
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.create = jest.fn().mockResolvedValue({
        ...mockTheme,
        isActive: true,
        isDefault: true,
      });

      await service.saveTheme(bothActiveDto);

      // Should call updateMany twice - once for active, once for default
      expect(prismaService.theme.updateMany).toHaveBeenCalledTimes(2);
      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        data: { isActive: false },
      });
      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId, isDefault: true },
        data: { isDefault: false },
      });
    });

    it('should use default values for optional fields', async () => {
      const minimalDto: SaveThemeDto = {
        name: 'Minimal Theme',
        userId: mockUserId,
      };
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      await service.saveTheme(minimalDto);

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

    it('should allow creating public themes', async () => {
      const publicDto = { ...saveDto, isPublic: true };
      prismaService.theme.create = jest.fn().mockResolvedValue({ ...mockTheme, isPublic: true });

      const result = await service.saveTheme(publicDto);

      expect(result.isPublic).toBe(true);
    });
  });

  // 2. UPDATE THEME TESTS
  describe('updateTheme', () => {
    const updateDto: UpdateThemeDto = {
      id: mockThemeId,
      name: 'Updated Theme',
      description: 'Updated description',
      userId: mockUserId,
    };

    it('should update a theme successfully', async () => {
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        name: 'Updated Theme',
      });

      const result = await service.updateTheme(updateDto);

      expect(prismaService.theme.update).toHaveBeenCalledWith({
        where: { id: mockThemeId },
        data: expect.objectContaining({
          name: 'Updated Theme',
          description: 'Updated description',
        }),
      });
      expect(result.name).toBe('Updated Theme');
    });

    it('should deactivate other themes when updating isActive to true', async () => {
      const activeUpdateDto = { ...updateDto, isActive: true };
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isActive: true,
      });

      await service.updateTheme(activeUpdateDto);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          isActive: true,
          id: { not: mockThemeId },
        },
        data: { isActive: false },
      });
    });

    it('should not affect other themes when isActive is false or undefined', async () => {
      const inactiveUpdateDto = { ...updateDto, isActive: false };
      prismaService.theme.update = jest.fn().mockResolvedValue(mockTheme);

      await service.updateTheme(inactiveUpdateDto);

      expect(prismaService.theme.updateMany).not.toHaveBeenCalled();
    });

    it('should exclude id from update data', async () => {
      prismaService.theme.update = jest.fn().mockResolvedValue(mockTheme);

      await service.updateTheme(updateDto);

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
      const saveDto: SaveThemeDto = { name: 'Test', userId: mockUserId };
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.createTheme(saveDto);

      expect(prismaService.theme.create).toHaveBeenCalled();
      expect(result).toEqual(mockTheme);
    });
  });

  // 6. GET ACTIVE THEME TESTS
  describe('getActiveTheme', () => {
    it('should return active theme for a user', async () => {
      const activeTheme = { ...mockTheme, isActive: true };
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(activeTheme);

      const result = await service.getActiveTheme(mockUserId);

      expect(prismaService.theme.findFirst).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
      });
      expect(result).toEqual(activeTheme);
    });

    it('should return null when no active theme exists for user', async () => {
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(null);

      const result = await service.getActiveTheme(mockUserId);

      expect(result).toBeNull();
    });

    it('should return public active theme when userId is undefined', async () => {
      const publicActiveTheme = { ...mockTheme, isPublic: true, isActive: true };
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(publicActiveTheme);

      const result = await service.getActiveTheme(undefined);

      expect(prismaService.theme.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true, isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(publicActiveTheme);
    });

    it('should return public active theme when userId is empty string', async () => {
      const publicActiveTheme = { ...mockTheme, isPublic: true, isActive: true };
      prismaService.theme.findFirst = jest.fn().mockResolvedValue(publicActiveTheme);

      const result = await service.getActiveTheme('');

      expect(prismaService.theme.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true, isActive: true },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  // 7. LIST THEMES TESTS
  describe('listThemes', () => {
    const mockThemes: Theme[] = [
      mockTheme,
      { ...mockTheme, id: 'theme-2', name: 'Theme 2' },
    ];

    it('should list themes for a user including public themes', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue(mockThemes);

      const result = await service.listThemes(mockUserId, true);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ userId: mockUserId }, { isPublic: true }],
        },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(mockThemes);
    });

    it('should list only user themes when includePublic is false', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue([mockTheme]);

      const result = await service.listThemes(mockUserId, false);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ userId: mockUserId }],
        },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual([mockTheme]);
    });

    it('should list only public themes when userId is undefined', async () => {
      const publicTheme = { ...mockTheme, isPublic: true };
      prismaService.theme.findMany = jest.fn().mockResolvedValue([publicTheme]);

      const result = await service.listThemes(undefined, true);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: { isPublic: true },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return empty array when no userId and includePublic is false', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.listThemes(undefined, false);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual([]);
    });
  });

  // 8. DELETE THEME TESTS
  describe('deleteTheme', () => {
    it('should delete a theme without userId verification', async () => {
      prismaService.theme.delete = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.deleteTheme(mockThemeId);

      expect(prismaService.theme.findUnique).not.toHaveBeenCalled();
      expect(prismaService.theme.delete).toHaveBeenCalledWith({
        where: { id: mockThemeId },
      });
      expect(result).toEqual(mockTheme);
    });

    it('should verify ownership and delete when userId is provided', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.delete = jest.fn().mockResolvedValue(mockTheme);

      const result = await service.deleteTheme(mockThemeId, mockUserId);

      expect(prismaService.theme.findUnique).toHaveBeenCalledWith({
        where: { id: mockThemeId },
      });
      expect(prismaService.theme.delete).toHaveBeenCalled();
      expect(result).toEqual(mockTheme);
    });

    it('should throw error when user does not own the theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue({
        ...mockTheme,
        userId: mockUser2Id, // Different user
      });

      await expect(service.deleteTheme(mockThemeId, mockUserId)).rejects.toThrow(
        'Unauthorized to delete this theme',
      );

      expect(prismaService.theme.delete).not.toHaveBeenCalled();
    });

    it('should throw error when theme not found during ownership check', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.deleteTheme(mockThemeId, mockUserId)).rejects.toThrow(
        'Unauthorized to delete this theme',
      );
    });
  });

  // 9. TOGGLE FAVORITE TESTS
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

    it('should throw error when theme not found', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.toggleFavorite(mockThemeId)).rejects.toThrow('Theme not found');

      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });

    it('should verify ownership when userId is provided', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isFavorite: true,
      });

      await service.toggleFavorite(mockThemeId, mockUserId);

      expect(prismaService.theme.update).toHaveBeenCalled();
    });

    it('should throw error when user does not own the theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue({
        ...mockTheme,
        userId: mockUser2Id,
      });

      await expect(service.toggleFavorite(mockThemeId, mockUserId)).rejects.toThrow(
        'Unauthorized to modify this theme',
      );

      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });
  });

  // 10. SET ACTIVE THEME TESTS
  describe('setActiveTheme', () => {
    it('should set theme as active and deactivate others', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 2 });
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isActive: true,
      });

      const result = await service.setActiveTheme(mockThemeId);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          isActive: true,
          id: { not: mockThemeId },
        },
        data: { isActive: false },
      });
      expect(prismaService.theme.update).toHaveBeenCalledWith({
        where: { id: mockThemeId },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });

    it('should throw error when theme not found', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.setActiveTheme(mockThemeId)).rejects.toThrow('Theme not found');

      expect(prismaService.theme.updateMany).not.toHaveBeenCalled();
      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });

    it('should verify ownership when userId is provided', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isActive: true,
      });

      await service.setActiveTheme(mockThemeId, mockUserId);

      expect(prismaService.theme.update).toHaveBeenCalled();
    });

    it('should throw error when user does not own the theme', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue({
        ...mockTheme,
        userId: mockUser2Id,
      });

      await expect(service.setActiveTheme(mockThemeId, mockUserId)).rejects.toThrow(
        'Unauthorized to activate this theme',
      );

      expect(prismaService.theme.update).not.toHaveBeenCalled();
    });

    it('should not call updateMany when theme has no userId', async () => {
      const themeWithoutUser = { ...mockTheme, userId: null };
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(themeWithoutUser);
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...themeWithoutUser,
        isActive: true,
      });

      await service.setActiveTheme(mockThemeId);

      expect(prismaService.theme.updateMany).not.toHaveBeenCalled();
      expect(prismaService.theme.update).toHaveBeenCalled();
    });
  });

  // 11. GET COMPANY THEMES TESTS
  describe('getCompanyThemes', () => {
    const companyThemes: Theme[] = [
      mockTheme,
      { ...mockTheme, id: 'theme-2', name: 'Company Theme 2' },
    ];

    it('should get all themes for a company', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue(companyThemes);

      const result = await service.getCompanyThemes(mockCompanyId);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(companyThemes);
    });

    it('should get only active company themes when activeOnly is true', async () => {
      const activeThemes = [{ ...mockTheme, isActive: true }];
      prismaService.theme.findMany = jest.fn().mockResolvedValue(activeThemes);

      const result = await service.getCompanyThemes(mockCompanyId, true);

      expect(prismaService.theme.findMany).toHaveBeenCalledWith({
        where: {
          companyId: mockCompanyId,
          isActive: true,
        },
        orderBy: { updatedAt: 'desc' },
      });
      expect(result).toEqual(activeThemes);
    });

    it('should return empty array when company has no themes', async () => {
      prismaService.theme.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.getCompanyThemes(mockCompanyId);

      expect(result).toEqual([]);
    });
  });

  // 12. SET DEFAULT THEME TESTS
  describe('setDefaultTheme', () => {
    it('should set theme as default for company', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isDefault: true,
        isActive: true,
      });

      const result = await service.setDefaultTheme(mockThemeId, mockCompanyId);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: {
          companyId: mockCompanyId,
          isDefault: true,
          id: { not: mockThemeId },
        },
        data: { isDefault: false },
      });
      expect(prismaService.theme.update).toHaveBeenCalledWith({
        where: { id: mockThemeId },
        data: { isDefault: true, isActive: true },
      });
      expect(result.isDefault).toBe(true);
      expect(result.isActive).toBe(true);
    });

    it('should throw error when theme not found', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.setDefaultTheme(mockThemeId, mockCompanyId),
      ).rejects.toThrow('Theme not found');

      expect(prismaService.theme.updateMany).not.toHaveBeenCalled();
    });

    it('should throw error when theme does not belong to company', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue({
        ...mockTheme,
        companyId: 'different-company',
      });

      await expect(
        service.setDefaultTheme(mockThemeId, mockCompanyId),
      ).rejects.toThrow('Theme does not belong to this company');

      expect(prismaService.theme.updateMany).not.toHaveBeenCalled();
    });

    it('should remove default flag from other themes in company', async () => {
      prismaService.theme.findUnique = jest.fn().mockResolvedValue(mockTheme);
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 2 });
      prismaService.theme.update = jest.fn().mockResolvedValue({
        ...mockTheme,
        isDefault: true,
      });

      await service.setDefaultTheme(mockThemeId, mockCompanyId);

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: {
          companyId: mockCompanyId,
          isDefault: true,
          id: { not: mockThemeId },
        },
        data: { isDefault: false },
      });
    });
  });

  // 13. MUTUAL EXCLUSIVITY TESTS
  describe('Mutual Exclusivity Logic', () => {
    it('should ensure only one active theme per user', async () => {
      const theme1 = { ...mockTheme, id: 'theme-1', isActive: true };
      const theme2 = { ...mockTheme, id: 'theme-2', isActive: false };

      // First theme is active
      prismaService.theme.create = jest.fn().mockResolvedValue(theme1);
      await service.saveTheme({ ...mockTheme, isActive: true, userId: mockUserId });

      // When creating second active theme, it should deactivate the first
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.create = jest.fn().mockResolvedValue(theme2);

      await service.saveTheme({ ...theme2, isActive: true, userId: mockUserId });

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        data: { isActive: false },
      });
    });

    it('should ensure only one default theme per company', async () => {
      prismaService.theme.updateMany = jest.fn().mockResolvedValue({ count: 1 });
      prismaService.theme.create = jest.fn().mockResolvedValue(mockTheme);

      await service.saveTheme({
        name: 'Default Theme',
        companyId: mockCompanyId,
        isDefault: true,
      });

      expect(prismaService.theme.updateMany).toHaveBeenCalledWith({
        where: { companyId: mockCompanyId, isDefault: true },
        data: { isDefault: false },
      });
    });
  });

  // 14. EDGE CASES AND ERROR HANDLING
  describe('Edge Cases', () => {
    it('should handle themes without userId', async () => {
      const themeWithoutUser = { ...mockTheme, userId: null };
      prismaService.theme.create = jest.fn().mockResolvedValue(themeWithoutUser);

      const result = await service.saveTheme({
        name: 'Public Theme',
        isPublic: true,
      });

      expect(result).toEqual(themeWithoutUser);
    });

    it('should handle themes without companyId', async () => {
      const themeWithoutCompany = { ...mockTheme, companyId: null };
      prismaService.theme.create = jest.fn().mockResolvedValue(themeWithoutCompany);

      const result = await service.saveTheme({
        name: 'Personal Theme',
        userId: mockUserId,
      });

      expect(result).toEqual(themeWithoutCompany);
    });

    it('should handle empty tags array', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue({
        ...mockTheme,
        tags: [],
      });

      const result = await service.saveTheme({
        name: 'No Tags Theme',
        userId: mockUserId,
        tags: [],
      });

      expect(result.tags).toEqual([]);
    });

    it('should default tags to empty array when not provided', async () => {
      prismaService.theme.create = jest.fn().mockResolvedValue({
        ...mockTheme,
        tags: [],
      });

      await service.saveTheme({
        name: 'Theme',
        userId: mockUserId,
      });

      expect(prismaService.theme.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tags: [],
        }),
      });
    });
  });
});
