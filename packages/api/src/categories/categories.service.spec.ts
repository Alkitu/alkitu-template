import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma.service';
import { Category } from '@prisma/client';

describe('CategoriesService (ALI-118)', () => {
  let service: CategoriesService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockCategoryId = '507f1f77bcf86cd799439011';
  const mockOtherCategoryId = '507f1f77bcf86cd799439012';
  const mockUserId = '507f1f77bcf86cd799439020';

  const mockCategory: Category = {
    id: mockCategoryId,
    name: 'Plumbing',
    deletedAt: null,
    createdBy: mockUserId,
    updatedBy: mockUserId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockCategoryWithServices = {
    ...mockCategory,
    services: [
      {
        id: '507f1f77bcf86cd799439013',
        name: 'Emergency Plumbing',
        thumbnail: 'https://example.com/plumbing.jpg',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      },
    ],
  };

  const createCategoryDto = {
    name: 'Electrical',
  };

  const updateCategoryDto = {
    name: 'HVAC',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      category: {
        create: jest.fn().mockResolvedValue(mockCategory),
        findMany: jest.fn().mockResolvedValue([mockCategory]),
        findFirst: jest.fn().mockResolvedValue(mockCategory),
        findUnique: jest.fn().mockResolvedValue(mockCategory),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockCategory, ...updateCategoryDto }),
        delete: jest.fn().mockResolvedValue(mockCategory),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      const result = await service.create(createCategoryDto, mockUserId);

      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { name: createCategoryDto.name, deletedAt: null },
      });
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: {
          ...createCategoryDto,
          createdBy: mockUserId,
          updatedBy: mockUserId,
        },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw ConflictException if category name already exists', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue(mockCategory);

      await expect(service.create(createCategoryDto, mockUserId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createCategoryDto, mockUserId)).rejects.toThrow(
        `Category with name "${createCategoryDto.name}" already exists`,
      );

      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { name: createCategoryDto.name, deletedAt: null },
      });
      expect(prismaService.category.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);
      prismaService.category.create = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(createCategoryDto, mockUserId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories with service count', async () => {
      const mockCategoriesWithCount = [
        {
          ...mockCategory,
          _count: { services: 5 },
        },
      ];

      prismaService.category.findMany = jest
        .fn()
        .mockResolvedValue(mockCategoriesWithCount);

      const result = await service.findAll();

      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { services: { where: { deletedAt: null } } },
          },
        },
      });
      expect(result).toEqual(mockCategoriesWithCount);
    });

    it('should return empty array if no categories exist', async () => {
      prismaService.category.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.category.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a category with its services', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValue(mockCategoryWithServices);

      const result = await service.findOne(mockCategoryId);

      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: mockCategoryId, deletedAt: null },
        include: {
          services: {
            where: { deletedAt: null },
            select: {
              id: true,
              name: true,
              thumbnail: true,
              createdAt: true,
            },
            orderBy: { name: 'asc' },
          },
        },
      });
      expect(result).toEqual(mockCategoryWithServices);
    });

    it('should throw NotFoundException if category not found', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(mockCategoryId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockCategoryId)).rejects.toThrow(
        `Category with ID "${mockCategoryId}" not found`,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(mockCategoryId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValueOnce(mockCategoryWithServices) // findOne call (needs services)
        .mockResolvedValueOnce(null); // name check

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      prismaService.category.update = jest
        .fn()
        .mockResolvedValue(updatedCategory);

      const result = await service.update(mockCategoryId, updateCategoryDto, mockUserId);

      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
        data: {
          ...updateCategoryDto,
          updatedBy: mockUserId,
        },
      });
      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(mockCategoryId, updateCategoryDto, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new name already exists', async () => {
      const otherCategory = { ...mockCategory, id: mockOtherCategoryId };

      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValueOnce(mockCategoryWithServices) // findOne call (needs services)
        .mockResolvedValueOnce(otherCategory); // name check

      await expect(
        service.update(mockCategoryId, updateCategoryDto, mockUserId),
      ).rejects.toThrow(
        new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        ),
      );

      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it('should allow updating with same name (no conflict)', async () => {
      const sameNameDto = { name: mockCategory.name };

      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValueOnce(mockCategoryWithServices) // findOne call (needs services)
        .mockResolvedValueOnce(mockCategory); // name check - same category

      prismaService.category.update = jest.fn().mockResolvedValue(mockCategory);

      const result = await service.update(mockCategoryId, sameNameDto, mockUserId);

      expect(prismaService.category.update).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.category.findFirst = jest
        .fn()
        .mockResolvedValueOnce(mockCategoryWithServices) // findOne call (needs services)
        .mockResolvedValueOnce(null);

      prismaService.category.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.update(mockCategoryId, updateCategoryDto, mockUserId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should soft delete a category with no services', async () => {
      const categoryWithoutServices = {
        ...mockCategory,
        services: [],
      };

      prismaService.category.findUnique = jest
        .fn()
        .mockResolvedValue(categoryWithoutServices);

      prismaService.category.update = jest
        .fn()
        .mockResolvedValue(mockCategory);

      const result = await service.remove(mockCategoryId);

      expect(prismaService.category.update).toHaveBeenCalledWith({
        where: { id: mockCategoryId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      prismaService.category.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(mockCategoryId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if category has services', async () => {
      prismaService.category.findUnique = jest
        .fn()
        .mockResolvedValue(mockCategoryWithServices);

      await expect(service.remove(mockCategoryId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.remove(mockCategoryId)).rejects.toThrow(
        `Cannot delete category with ${mockCategoryWithServices.services.length} service(s)`,
      );

      expect(prismaService.category.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const categoryWithoutServices = {
        ...mockCategory,
        services: [],
      };

      prismaService.category.findUnique = jest
        .fn()
        .mockResolvedValue(categoryWithoutServices);

      prismaService.category.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.remove(mockCategoryId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('count', () => {
    it('should return the total number of categories', async () => {
      prismaService.category.count = jest.fn().mockResolvedValue(10);

      const result = await service.count();

      expect(prismaService.category.count).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(10);
    });

    it('should return 0 if no categories exist', async () => {
      prismaService.category.count = jest.fn().mockResolvedValue(0);

      const result = await service.count();

      expect(result).toBe(0);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.category.count = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.count()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
